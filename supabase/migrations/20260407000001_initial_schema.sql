-- =============================================================
-- Ynni Cymunedol Llanfairfechan — Initial Schema
-- Migration: 20260407000001
-- =============================================================

-- Enable UUID extension (available by default on Supabase)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================
-- MEMBERS
-- =============================================================

CREATE TABLE members (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    timestamptz NOT NULL DEFAULT now(),
  email         text UNIQUE NOT NULL,
  full_name     text,
  status        text NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'active', 'suspended')),
  eligible_to_vote boolean NOT NULL DEFAULT false,
  postcode      text,
  joined_at     timestamptz,
  approved_at   timestamptz,
  approved_by   uuid REFERENCES members(id)
);

-- =============================================================
-- BALLOTS
-- =============================================================

CREATE TABLE ballots (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      timestamptz NOT NULL DEFAULT now(),
  title_cy        text NOT NULL,
  title_en        text NOT NULL,
  description_cy  text,
  description_en  text,
  status          text NOT NULL DEFAULT 'draft'
                    CHECK (status IN ('draft', 'open', 'closed')),
  opens_at        timestamptz NOT NULL,
  closes_at       timestamptz NOT NULL,
  quorum          int,
  created_by      uuid NOT NULL REFERENCES members(id)
);

-- =============================================================
-- BALLOT OPTIONS
-- =============================================================

CREATE TABLE ballot_options (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz NOT NULL DEFAULT now(),
  ballot_id   uuid NOT NULL REFERENCES ballots(id) ON DELETE CASCADE,
  label_cy    text NOT NULL,
  label_en    text NOT NULL,
  sort_order  int NOT NULL DEFAULT 0
);

-- =============================================================
-- VOTES
-- =============================================================

CREATE TABLE votes (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz NOT NULL DEFAULT now(),
  ballot_id   uuid NOT NULL REFERENCES ballots(id),
  member_id   uuid NOT NULL REFERENCES members(id),
  option_id   uuid NOT NULL REFERENCES ballot_options(id),
  voted_at    timestamptz NOT NULL DEFAULT now(),

  -- Enforce one vote per member per ballot at the DB layer
  UNIQUE (ballot_id, member_id)
);

-- =============================================================
-- EMAIL AUDIT LOG
-- =============================================================

CREATE TABLE email_sends (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      timestamptz NOT NULL DEFAULT now(),
  template        text NOT NULL,
  subject         text NOT NULL,
  recipient_count int NOT NULL DEFAULT 0,
  triggered_by    uuid NOT NULL REFERENCES members(id),
  sent_at         timestamptz NOT NULL DEFAULT now()
);

-- =============================================================
-- ROW LEVEL SECURITY
-- =============================================================

ALTER TABLE members       ENABLE ROW LEVEL SECURITY;
ALTER TABLE ballots        ENABLE ROW LEVEL SECURITY;
ALTER TABLE ballot_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes          ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_sends    ENABLE ROW LEVEL SECURITY;

-- Helper: check if the authenticated user has admin status
-- (We store admin flag via a Supabase custom claim or a join to members.status;
--  for now we use a simple check — replace with JWT claim in production.)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM members
    WHERE id = auth.uid()
      AND status = 'active'
      -- admin distinguished by a separate role column in Phase 2;
      -- for MVP this function is a placeholder — grant admin via service role
  );
$$;

-- ---- members ----

CREATE POLICY "members: own row read"
  ON members FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "members: own row update"
  ON members FOR UPDATE
  USING (id = auth.uid());

-- Members can insert their own row during sign-up
CREATE POLICY "members: insert own"
  ON members FOR INSERT
  WITH CHECK (id = auth.uid());

-- ---- ballots ----

-- Public read for open and closed ballots
CREATE POLICY "ballots: public read open/closed"
  ON ballots FOR SELECT
  USING (status IN ('open', 'closed'));

-- ---- ballot_options ----

CREATE POLICY "ballot_options: public read"
  ON ballot_options FOR SELECT
  USING (true);

-- ---- votes ----

-- Members can vote if ballot is open and they are eligible
CREATE POLICY "votes: eligible member insert"
  ON votes FOR INSERT
  WITH CHECK (
    member_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM members
      WHERE id = auth.uid() AND eligible_to_vote = true
    )
    AND EXISTS (
      SELECT 1 FROM ballots
      WHERE id = ballot_id AND status = 'open'
        AND now() BETWEEN opens_at AND closes_at
    )
  );

-- Members can only read their own vote
CREATE POLICY "votes: own vote read"
  ON votes FOR SELECT
  USING (member_id = auth.uid());

-- ---- email_sends ----
-- No self-service access; managed via service role key in Route Handlers

-- =============================================================
-- INDEXES
-- =============================================================

CREATE INDEX idx_members_status ON members(status);
CREATE INDEX idx_ballots_status ON ballots(status);
CREATE INDEX idx_ballots_dates  ON ballots(opens_at, closes_at);
CREATE INDEX idx_votes_ballot   ON votes(ballot_id);
CREATE INDEX idx_votes_member   ON votes(member_id);
