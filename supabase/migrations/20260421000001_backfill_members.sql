-- =============================================================
-- Ynni Cymunedol Llanfairfechan — Backfill members from auth
-- Migration: 20260421000001
-- =============================================================
-- Creates a members row for any auth.users record that doesn't
-- already have one. Safe to run multiple times (ON CONFLICT DO NOTHING).
-- Needed for accounts created before the auth trigger was in place.
-- =============================================================

INSERT INTO public.members (id, email, full_name, status, eligible_to_vote, joined_at)
SELECT
  au.id,
  au.email,
  COALESCE(
    au.raw_user_meta_data->>'full_name',
    au.raw_user_meta_data->>'name'
  ),
  'pending',
  false,
  COALESCE(au.created_at, now())
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM public.members m WHERE m.id = au.id
);
