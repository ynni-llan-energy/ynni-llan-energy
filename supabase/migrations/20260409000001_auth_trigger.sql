-- =============================================================
-- Ynni Cymunedol Llanfairfechan — Auth Trigger
-- Migration: 20260409000001
-- =============================================================
-- Automatically creates a members row when a new auth.users
-- record is inserted (covers both email/password and OAuth).
-- The members.id is set to auth.uid() so RLS policies work.
-- =============================================================

CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.members (
    id,
    email,
    full_name,
    status,
    eligible_to_vote,
    joined_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    -- Prefer full_name from metadata (email signup), then name (OAuth)
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name'
    ),
    'pending',
    false,
    now()
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Drop trigger if it already exists (idempotent)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_auth_user();
