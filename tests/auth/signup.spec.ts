import { randomBytes } from "crypto";
import { test, expect } from "../fixtures";
import { deleteTestUserByEmail } from "../helpers/auth";

test.describe("Signup page", () => {
  test("page renders with expected content", async ({ page }) => {
    await page.goto("/ymuno");

    await expect(page).toHaveTitle(/Ymuno/);
    // Welsh heading visible
    await expect(page.getByRole("heading", { name: /Ymunwch â ni/i })).toBeVisible();
    // Name and email fields present; no password field, no Google button
    await expect(page.locator("#full_name")).toBeVisible();
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#password")).toHaveCount(0);
    await expect(page.getByRole("button", { name: /Google/i })).toHaveCount(0);
  });

  test("shows validation error for empty name", async ({ page }) => {
    await page.goto("/ymuno");

    await page.fill("#email", "someone@example.com");
    await page.click('form [type="submit"]');

    await expect(page).toHaveURL(/ymuno/);
    await expect(page.getByRole("alert").first()).toBeVisible();
  });

  test("shows validation error for invalid email", async ({ page }) => {
    await page.goto("/ymuno");

    await page.fill("#full_name", "Test User");
    await page.fill("#email", "not-an-email");
    await page.click('form [type="submit"]');

    await expect(page).toHaveURL(/ymuno/);
    await expect(page.getByRole("alert").first()).toBeVisible();
  });

  test("valid signup redirects to thank-you page", async ({ page }) => {
    const suffix = randomBytes(4).toString("hex");
    const email = `e2e-signup-${suffix}@example.com`;

    await page.goto("/ymuno");

    await page.fill("#full_name", `Signup Test ${suffix}`);
    await page.fill("#email", email);
    await page.check("#policy_consent");
    await page.click('form [type="submit"]');

    await page.waitForURL("**/ymuno/diolch", { timeout: 15_000 });
    await expect(page).toHaveURL(/ymuno\/diolch/);

    // Cleanup — best effort
    try {
      await deleteTestUserByEmail(email);
    } catch {
      // ignore cleanup errors
    }
  });

  test("authenticated user is redirected away from signup page", async ({
    authenticatedPage,
  }) => {
    // Already logged in — navigating to /ymuno should redirect to /aelodau
    await authenticatedPage.goto("/ymuno");
    await authenticatedPage.waitForURL("**/aelodau", { timeout: 10_000 });
    await expect(authenticatedPage).toHaveURL(/aelodau/);
  });
});
