import { test, expect } from "../fixtures";
import { generateMagicLink } from "../helpers/auth";

test.describe("Protected route behaviour", () => {
  test("unauthenticated request to /aelodau redirects to /mewngofnodi", async ({
    page,
  }) => {
    await page.goto("/aelodau");

    // Should be redirected to login page
    await page.waitForURL("**/mewngofnodi**", { timeout: 10_000 });
    await expect(page).toHaveURL(/mewngofnodi/);
  });

  test("redirect preserves the ?next param so we can return post-login", async ({
    page,
  }) => {
    await page.goto("/aelodau");
    await page.waitForURL("**/mewngofnodi**", { timeout: 10_000 });
    // proxy.ts appends ?next=/aelodau
    await expect(page).toHaveURL(/next=%2Faelodau/);
  });

  test("authenticated user can access /aelodau", async ({
    authenticatedPage,
  }) => {
    // authenticatedPage fixture is already on /aelodau
    await expect(authenticatedPage).toHaveURL(/aelodau/);
    // Confirm the page heading is visible
    await expect(
      authenticatedPage.getByRole("heading", { name: /Fy Nghyfrif/i })
    ).toBeVisible();
  });

  test("after clicking magic link, user lands on /aelodau", async ({
    page,
    testUser,
  }) => {
    const magicLink = await generateMagicLink(testUser.email);
    await page.goto(magicLink);
    await page.waitForURL("**/aelodau", { timeout: 15_000 });
    await expect(page).toHaveURL(/aelodau/);
  });
});
