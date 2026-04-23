import { flag } from "flags/next";

/**
 * Controls whether the full site is visible.
 *
 * true  → site is open (normal operation)
 * false → WIP redirect is active
 *
 * Controlled via the Vercel Flags dashboard. Override per-session via the
 * Vercel Toolbar (requires FLAGS_SECRET env var).
 */
export const wholeSiteFlag = flag<boolean>({
  key: "whole-site",
  defaultValue: false,
  description:
    "Enables the full site; when off all traffic sees the coming-soon page.",
  options: [
    { label: "Off (coming soon)", value: false },
    { label: "On (full site)", value: true },
  ],
});
