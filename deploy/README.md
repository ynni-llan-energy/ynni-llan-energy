# Hetzner deploy — operator runbook

Everything in this repo (`Dockerfile`, `docker-compose.yml`, `Caddyfile`,
`deploy/`, `.github/workflows/deploy.yml`) is ready to deploy. The steps
below are the one-time, on-the-box setup that has to happen by hand —
nothing here can be scripted from CI since it's about the box's own trust
boundary (SSH keys, secrets, DNS).

## 1. Box basics

Assuming the box already exists (reused from OpenClaw) — confirm rather
than assume:
- SSH is keys-only, a non-root user exists for deploys, `fail2ban` and
  `ufw` are active.
- Docker + the Compose plugin are installed (`docker compose version`
  should work, not the standalone `docker-compose`).
- The deploy user is in the `docker` group (`sudo usermod -aG docker
  <user>`), so it can run `docker compose` without `sudo`.

## 2. Deploy directory

```bash
sudo mkdir -p /opt/ynni-llan-energy
sudo chown <deploy-user>:<deploy-user> /opt/ynni-llan-energy
cd /opt/ynni-llan-energy
```

Copy `docker-compose.yml`, `Caddyfile`, and the `deploy/` directory here
(scp, or a shallow git clone — either works; only these files are needed on
the box, not the full app source, since CI builds the images).

```bash
cp .env.production.example .env
# then edit .env with real values — see its comments for what each does
```

## 3. GHCR access on the box

`docker compose pull` needs to read the images CI pushes. Simplest path:
make the two GHCR packages (`ynni-llan-energy-web`, `ynni-llan-energy-migrate`)
public once they exist (Package settings → Change visibility) — the images
contain no secrets by design (see `Dockerfile`'s header comment), so this
is low-risk. If you'd rather keep them private, `docker login ghcr.io` once
on the box with a PAT that has `read:packages` scope; the credential
persists in the deploy user's Docker config.

## 4. DNS

Point `SITE_DOMAIN` (from `.env`) at the box's IP. Lower the TTL a day or
two ahead of the real cutover so the eventual flip propagates fast.

## 5. Backups (rclone)

```bash
sudo apt install rclone
rclone config   # set up a remote — Hetzner Storage Box (SFTP) or B2
```

Name the remote to match `RCLONE_REMOTE` in `deploy/backup-db.sh` (or set
`RCLONE_REMOTE` in `.env` — the script reads it from there via
`source .env`). Once configured, run the backup script by hand once and
confirm a file actually lands in the remote before trusting the timer.

## 6. GitHub Actions deploy access

Add these repo secrets (Settings → Secrets and variables → Actions):
- `HETZNER_HOST` — the box's IP or hostname
- `HETZNER_SSH_USER` — the deploy user from step 1
- `HETZNER_SSH_KEY` — a private key whose public half is in that user's
  `~/.ssh/authorized_keys` (a dedicated deploy key, not a personal one)
- `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_PREVIEW_SECRET` —
  same values as production, needed at build time since they're inlined
  into the client bundle (see `Dockerfile`)

## 7. Install the systemd timers

```bash
sudo cp deploy/systemd/*.service deploy/systemd/*.timer /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now ynni-llan-backup.timer
sudo systemctl enable --now ynni-llan-cron-membership.timer
sudo systemctl enable --now ynni-llan-cron-admin-digest.timer
```

Enable the `.timer` units, not the `.service` units directly — the service
files are `Type=oneshot`, meant to be triggered by their timer (or manually
with `systemctl start ynni-llan-backup.service` to test one immediately).

## 8. First deploy

Either push to `main` (triggers `.github/workflows/deploy.yml`), or do it
by hand once to confirm the box side works before trusting CI with it:

```bash
cd /opt/ynni-llan-energy
docker compose pull
docker compose run --rm migrate
docker compose up -d
```

## 9. Data migration (once, at real cutover)

See `scripts/migrate-from-supabase.ts` — read its header comment in full
before running it against production. Rehearse against a disposable
database first; the real run happens once, right before the DNS flip.

## 10. Restore test

Do this before go-live, not after you need it. Download a backup from the
remote, `gunzip`, and `psql` it into a scratch database — confirm row
counts and a spot-checked member row, the same way
`scripts/migrate-from-supabase.ts` verifies its own migration. A backup
that has never been restored is a guess, not a backup.

## 11. Cutover and rollback

Soak-test this box (via its IP or a staging subdomain) against a rehearsed
copy of production data while the live Supabase/Vercel site keeps serving
real traffic, untouched. When ready: run the real data migration, flip
`SITE_DOMAIN`'s DNS, and keep the old stack live and paid-for as rollback
for about a week before decommissioning Supabase and Vercel.
