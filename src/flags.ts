import { flag } from "flags/next";

/**
 * Controls whether the full site is visible.
 *
 * true  → site is open (normal operation)
 * false → WIP redirect is active
 *
 * Change decide() to return false (and deploy) to re-enable the coming-soon page.
 * In preview/development/CI: always true so smoke and E2E tests run against
 * real pages rather than the coming-soon redirect.
 */
export const wholeSiteFlag = flag<boolean>({
  key: "whole-site",
  defaultValue: true,
  description:
    "Enables the full site; when off all traffic sees the coming-soon page.",
  options: [
    { label: "Off (coming soon)", value: false },
    { label: "On (full site)", value: true },
  ],
  decide() {
    if (process.env.VERCEL_ENV !== "production") return true;
    return true;
  },
});
