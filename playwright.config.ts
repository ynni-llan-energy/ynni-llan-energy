import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration.
 *
 * LOCAL DEV  — run `supabase start` then `npm run test:e2e`
 *              playwright will reuse a running dev server or start one.
 * CI         — the workflow starts Supabase + the Next.js server before this
 *              runs, so we just point at localhost:3000 and skip webServer.
 */
const baseURL = process.env.BASE_URL ?? "http://localhost:3000";

export default defineConfig({
  testDir: "./tests",

  // Sequential execution prevents auth-state race conditions.
  fullyParallel: false,
  workers: 1,

  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,

  reporter: process.env.CI
    ? [["github"], ["html", { open: "never" }]]
    : "html",

  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  // In local dev, start Next.js automatically if nothing is listening on :3000.
  // In CI the server is pre-started by the workflow, so skip this block.
  ...(!process.env.CI && {
    webServer: {
      command: "npm run dev",
      url: baseURL,
      reuseExistingServer: true,
      timeout: 120_000,
    },
  }),
});
