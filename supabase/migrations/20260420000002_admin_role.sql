-- =============================================================
-- Ynni Cymunedol Llanfairfechan — Tighten is_admin() guard
-- Migration: 20260420000002
-- =============================================================
-- 20260413000001 already adds the is_admin column and a basic
-- is_admin() function.  This migration replaces that function
-- with a stricter version that also requires status = 'active',
-- so a suspended admin automatically loses access without needing
-- a separate flag update.

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM members
    WHERE id       = auth.uid()
      AND is_admin = true
      AND status   = 'active'
  );
$$;
