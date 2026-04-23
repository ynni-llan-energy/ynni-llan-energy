-- =============================================================
-- Ynni Cymunedol Llanfairfechan — Volunteer Role Interest
-- Migration: 20260420000001
-- =============================================================

CREATE TABLE role_interest (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz NOT NULL DEFAULT now(),
  role_slug   text NOT NULL,
  role_title  text NOT NULL,
  member_id   uuid NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  statement   text,

  -- One expression of interest per member per role
  UNIQUE (role_slug, member_id)
);

ALTER TABLE role_interest ENABLE ROW LEVEL SECURITY;

-- Members can submit their own interest
CREATE POLICY "role_interest: member insert"
  ON role_interest FOR INSERT
  WITH CHECK (member_id = auth.uid());

-- Members can see their own submissions
CREATE POLICY "role_interest: own read"
  ON role_interest FOR SELECT
  USING (member_id = auth.uid());

-- Admins can read all submissions (permissive policies are OR'd together)
CREATE POLICY "role_interest: admin read all"
  ON role_interest FOR SELECT
  USING (is_admin());

CREATE INDEX idx_role_interest_slug   ON role_interest(role_slug);
CREATE INDEX idx_role_interest_member ON role_interest(member_id);
