-- =============================================================
-- Ynni Cymunedol Llanfairfechan — Member Administration
-- Migration: 20260413000001
-- =============================================================
-- Adds:
--   • is_admin flag on members
--   • membership_expires_at  — set to 12 months after verification
--   • renewal_notified_at    — tracks when the last renewal reminder was sent
--   • 'expired' as a valid status value
--   • Admin read/update RLS policies
--   • Updated is_admin() helper (now checks the real column)
-- =============================================================

-- ── members: new columns ──────────────────────────────────────────────────────

ALTER TABLE members
  ADD COLUMN is_admin              boolean     NOT NULL DEFAULT false,
  ADD COLUMN membership_expires_at timestamptz,
  ADD COLUMN renewal_notified_at   timestamptz;

-- ── status: extend valid values to include 'expired' ─────────────────────────
-- The original inline CHECK constraint is named <table>_<column>_check by
-- Postgres convention.  We drop and recreate it with the new value.

ALTER TABLE members DROP CONSTRAINT members_status_check;
ALTER TABLE members ADD CONSTRAINT members_status_check
  CHECK (status IN ('pending', 'active', 'suspended', 'expired'));

-- ── is_admin() helper — now uses the real column ─────────────────────────────

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM members
    WHERE id    = auth.uid()
      AND is_admin = true
  );
$$;

-- ── RLS: admins can read all member rows ─────────────────────────────────────

CREATE POLICY "members: admin read all"
  ON members FOR SELECT
  USING (is_admin());

-- ── RLS: admins can update any member row ────────────────────────────────────

CREATE POLICY "members: admin update all"
  ON members FOR UPDATE
  USING (is_admin());

-- ── index: speed up cron expiry queries ──────────────────────────────────────

CREATE INDEX idx_members_expires_at
  ON members (membership_expires_at)
  WHERE membership_expires_at IS NOT NULL;

CREATE INDEX idx_members_is_admin
  ON members (is_admin)
  WHERE is_admin = true;
