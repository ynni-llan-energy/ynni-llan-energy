import { test, expect } from "../fixtures";

test.describe("Login page", () => {
  test("page renders with expected content", async ({ page }) => {
    await page.goto("/mewngofnodi");

    await expect(page).toHaveTitle(/Mewngofnodi/);
    // Welsh heading visible
    await expect(
      page.getByRole("heading", { name: /Mewngofnodwch/i })
    ).toBeVisible();
    // Google button present
    await expect(page.getByRole("button", { name: /Google/i })).toBeVisible();
    // Email and password fields present
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#password")).toBeVisible();
  });

  test("valid credentials redirect to member dashboard", async ({
    page,
    testUser,
  }) => {
    await page.goto("/mewngofnodi");

    await page.fill("#email", testUser.email);
    await page.fill("#password", testUser.password);
    await page.click('form:has(#email) [type="submit"]');

    await page.waitForURL("**/aelodau", { timeout: 15_000 });
    await expect(page).toHaveURL(/aelodau/);
  });

  test("wrong password shows error", async ({ page, testUser }) => {
    await page.goto("/mewngofnodi");

    await page.fill("#email", testUser.email);
    await page.fill("#password", "WrongPassword!");
    await page.click('form:has(#email) [type="submit"]');

    // Should stay on /mewngofnodi and show an error
    await expect(page).toHaveURL(/mewngofnodi/);
    await expect(page.getByRole("alert").first()).toBeVisible();
  });

  test("unknown email shows error", async ({ page }) => {
    await page.goto("/mewngofnodi");

    await page.fill("#email", "nobody@nowhere.example");
    await page.fill("#password", "Password123!");
    await page.click('form:has(#email) [type="submit"]');

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
