-- =============================================================
-- Ynni Cymunedol Llanfairfechan — Admin Role
-- Migration: 20260420000002
-- =============================================================

-- Add is_admin flag to members table
ALTER TABLE members
  ADD COLUMN is_admin boolean NOT NULL DEFAULT false;

-- Update the is_admin() helper function to check the real column.
-- SECURITY DEFINER means it runs as the function owner (postgres),
-- so it can read members rows regardless of RLS.
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM members
    WHERE id = auth.uid()
      AND is_admin = true
      AND status = 'active'
  );
$$;
