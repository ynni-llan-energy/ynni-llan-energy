-- =============================================================
-- Ynni Cymunedol Llanfairfechan — Policy Consent
-- Migration: 20260423000001
-- =============================================================
-- Adds:
--   • policy_consent_at — timestamp when the member agreed to
--     the membership and privacy policies at signup
-- Updates:
--   • handle_new_auth_user() trigger to carry the consent
--     timestamp from OTP metadata into the members row
-- =============================================================

ALTER TABLE members
  ADD COLUMN policy_consent_at timestamptz;

-- ── Update trigger to capture consent timestamp from OTP metadata ─────────────

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
    joined_at,
    policy_consent_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name'
    ),
    'pending',
    false,
    now(),
    (NEW.raw_user_meta_data->>'policy_consent_at')::timestamptz
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;
