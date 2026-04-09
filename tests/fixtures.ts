import { test as base, expect, type Page } from "@playwright/test";
import { randomBytes } from "crypto";
import { createTestUser, deleteTestUser, type TestUserRecord } from "./helpers/auth";

type Fixtures = {
  /** A confirmed Supabase user that is cleaned up after the test. */
  testUser: TestUserRecord;
  /**
   * A Page that is already logged in as `testUser`.
   * The session is established via the UI login flow.
   */
  authenticatedPage: Page;
};

export const test = base.extend<Fixtures>({
  testUser: async ({}, use) => {
    const suffix = randomBytes(4).toString("hex");
    const email = `e2e-${suffix}@example.com`;
    const password = "TestPass123!";
    const fullName = `E2E User ${suffix}`;

    const user = await createTestUser(email, password, fullName);

    await use(user);

    // Always clean up, even if the test fails.
    await deleteTestUser(user.id);
  },

  authenticatedPage: async ({ page, testUser }, use) => {
    await page.goto("/mewngofnodi");

    await page.fill("#email", testUser.email);
    await page.fill("#password", testUser.password);

    // Click the email/password submit button (not the Google button)
    await page.click('form:has(#email) [type="submit"]');

    // Wait for redirect to the member dashboard
    await page.waitForURL("**/aelodau", { timeout: 15_000 });

    await use(page);
  },
});

export { expect };
