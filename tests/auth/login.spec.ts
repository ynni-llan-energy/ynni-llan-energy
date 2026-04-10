import { test, expect } from "../fixtures";

test.describe("Login page", () => {
  test("page renders with expected content", async ({ page }) => {
    await page.goto("/mewngofnodi");

    await expect(page).toHaveTitle(/Mewngofnodi/);
    // Welsh heading visible
    await expect(
      page.getByRole("heading", { name: /Mewngofnodi/i })
    ).toBeVisible();
    // Email field present (no password field)
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#password")).toHaveCount(0);
  });

  test("submitting a valid email shows sent confirmation", async ({
    page,
    testUser,
  }) => {
    await page.goto("/mewngofnodi");

    // Use testUser.email — newer Supabase returns an error for non-existent
    // addresses when shouldCreateUser:false, so we need a real account.
    await page.fill("#email", testUser.email);
    await page.click('[type="submit"]');

    // Should show the "check your email" success state
    await expect(page.getByRole("status")).toBeVisible();
    await expect(page.getByText(/Gwiriwch eich e-bost/i)).toBeVisible();
  });

  test("submitting an invalid email shows validation error", async ({ page }) => {
    await page.goto("/mewngofnodi");

    await page.fill("#email", "not-an-email");
    await page.click('[type="submit"]');

    await expect(page).toHaveURL(/mewngofnodi/);
    await expect(page.getByRole("alert").first()).toBeVisible();
  });

  test("authenticated user is redirected away from login page", async ({
    authenticatedPage,
  }) => {
    // Already logged in — navigating to /mewngofnodi should redirect to /aelodau
    await authenticatedPage.goto("/mewngofnodi");
    await authenticatedPage.waitForURL("**/aelodau", { timeout: 10_000 });
    await expect(authenticatedPage).toHaveURL(/aelodau/);
  });
});
