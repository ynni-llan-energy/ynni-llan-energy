import { test as base, expect, type Page } from "@playwright/test";
import { randomBytes } from "crypto";
import {
  createTestUser,
  deleteTestUser,
  generateMagicLink,
  type TestUserRecord,
} from "./helpers/auth";

type Fixtures = {
  /** A confirmed Supabase user that is cleaned up after the test. */
  testUser: TestUserRecord;
  /**
   * A Page that is already logged in as `testUser`.
   * The session is established by navigating directly to an admin-generated
   * magic link, bypassing the email delivery step.
   */
  authenticatedPage: Page;
};

export const test = base.extend<Fixtures>({
  testUser: async ({}, use) => {
    const suffix = randomBytes(4).toString("hex");
    const email = `e2e-${suffix}@example.com`;
    const fullName = `E2E User ${suffix}`;

    const user = await createTestUser(email, fullName);

    await use(user);

    // Always clean up, even if the test fails.
    await deleteTestUser(user.id);
  },

  authenticatedPage: async ({ page, testUser }, use) => {
    const magicLink = await generateMagicLink(testUser.email);

    // Navigate directly to the magic link — this exchanges the token and
    // redirects to /aelodau, establishing a real browser session.
    await page.goto(magicLink);
    await page.waitForURL("**/aelodau", { timeout: 15_000 });

    await use(page);
  },
});

export { expect };
