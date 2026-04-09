import { randomBytes } from "crypto";
import { test, expect } from "../fixtures";
import { deleteTestUser } from "../helpers/auth";

/**
 * Signup flow tests.
 * These run against a local Supabase instance so no production data is touched.
 * `enable_confirmations = false` in config.toml means sign-up logs the user in
 * immediately without an email round-trip.
 */
test.describe("Signup page", () => {
  test("page renders with expected content", async ({ page }) => {
    await page.goto("/ymuno");

    await expect(page).toHaveTitle(/Ymuno/);
    // Welsh heading visible
    await expect(page.getByRole("heading", { name: /Ymunwch â ni/i })).toBeVisible();
    // Google button present
    await expect(page.getByRole("button", { name: /Google/i })).toBeVisible();
    // Email and password fields present
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#password")).toBeVisible();
  });

  test("shows validation error for empty name", async ({ page }) => {
    await page.goto("/ymuno");

    await page.fill("#email", "someone@example.com");
    await page.fill("#password", "Password123!");
    await page.click('form:has(#email) [type="submit"]');

    // Should stay on /ymuno and show a field error
    await expect(page).toHaveURL(/ymuno/);
    await expect(page.getByRole("alert").first()).toBeVisible();
  });

  test("shows validation error for invalid email", async ({ page }) => {
    await page.goto("/ymuno");

    await page.fill("#full_name", "Test User");
    await page.fill("#email", "not-an-email");
    await page.fill("#password", "Password123!");
    await page.click('form:has(#email) [type="submit"]');

    await expect(page).toHaveURL(/ymuno/);
    await expect(page.getByRole("alert").first()).toBeVisible();
  });

  test("shows validation error for short password", async ({ page }) => {
    await page.goto("/ymuno");

    await page.fill("#full_name", "Test User");
    await page.fill("#email", "someone@example.com");
    await page.fill("#password", "abc");
    await page.click('form:has(#email) [type="submit"]');

    await expect(page).toHaveURL(/ymuno/);
    await expect(page.getByRole("alert").first()).toBeVisible();
  });

  test("valid signup redirects to thank-you page", async ({ page }) => {
    const suffix = randomBytes(4).toString("hex");
    const email = `e2e-signup-${suffix}@example.com`;

    await page.goto("/ymuno");

    await page.fill("#full_name", `Signup Test ${suffix}`);
    await page.fill("#email", email);
    await page.fill("#password", "Password123!");
    await page.click('form:has(#email) [type="submit"]');

    // Expect redirect to thank-you page
    await page.waitForURL("**/ymuno/diolch", { timeout: 15_000 });
    await expect(page).toHaveURL(/ymuno\/diolch/);

    // Cleanup: find the user id by signing in, then delete
    // (the admin helper does not have email lookup, so we delete via sign-in)
    // Best effort — we log any failure rather than failing the test.
    try {
      const res = await fetch(
        `${process.env.SUPABASE_URL ?? "http://localhost:54321"}/auth/v1/token?grant_type=password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey:
              process.env.SUPABASE_ANON_KEY ??
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRFA0NiK7kyqd7Fy4hwCgv0243T7oNKi-dhYYYh9OF0",
          },
          body: JSON.stringify({ email, password: "Password123!" }),
        }
      );
      if (res.ok) {
        const { user } = await res.json();
        if (user?.id) await deleteTestUser(user.id);
      }
    } catch {
      // ignore cleanup errors
    }
  });

  test("shows error for duplicate email", async ({ page, testUser }) => {
    // testUser already exists with a confirmed account
    await page.goto("/ymuno");

    await page.fill("#full_name", "Duplicate Test");
    await page.fill("#email", testUser.email);
    await page.fill("#password", "Password123!");
    await page.click('form:has(#email) [type="submit"]');

    // Should stay on /ymuno and show some error
    await expect(page).toHaveURL(/ymuno/);
    // Supabase returns "User already registered" — we show a generic alert
    await expect(page.getByRole("alert").first()).toBeVisible();
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
