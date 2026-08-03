-- =============================================================
-- Ynni Cymunedol Llanfairfechan — Explicit Role Grants
-- Migration: 20260424000001
-- =============================================================
-- Supabase normally bootstraps anon/authenticated/service_role with
-- blanket privileges on the public schema outside of user migrations, with
-- row level security doing the actual access control (as configured per
-- table throughout this project's migrations). That bootstrap step has
-- proven unreliable in some local/CI environments, leaving tables such as
-- `members` inaccessible even to service_role. Grant explicitly here so
-- correctness doesn't depend on it.
-- =============================================================

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
