import { test, expect } from "../fixtures";

test.describe("Member dashboard (/aelodau)", () => {
  test("shows member's full name in the profile form", async ({
    authenticatedPage,
    testUser,
  }) => {
    // View mode shows the name as text, not an input
    await expect(
      authenticatedPage.getByText(testUser.fullName)
    ).toBeVisible();
  });

  test("shows voting-not-verified notice for a new member", async ({
    authenticatedPage,
  }) => {
    // New members are always unverified (eligible_to_vote = false by default)
    await expect(
      authenticatedPage.getByText(/Nid ydych wedi eich dilysu/i)
    ).toBeVisible();
  });

  test("shows pending status badge for a new member", async ({
    authenticatedPage,
  }) => {
    // New members have status = 'pending'
    await expect(
      authenticatedPage.getByText(/Yn aros/i)
    ).toBeVisible();
  });

  test("can update profile name and postcode", async ({
    authenticatedPage,
    testUser,
  }) => {
    const newName = `${testUser.fullName} Updated`;

    // Open edit mode first (ProfileForm starts in view mode)
    await authenticatedPage.click('button[aria-label*="Golygu"]');

    // Fill in the inputs now visible in edit mode
    await authenticatedPage.fill("#full_name", newName);
    await authenticatedPage.fill("#postcode", "LL33 0AA");

    // Submit
    await authenticatedPage.click('section [type="submit"]');

    // ProfileForm renders a green "Wedi ei gadw! / Saved!" banner on success
    await expect(
      authenticatedPage.getByText(/Wedi ei gadw/i)
    ).toBeVisible({ timeout: 10_000 });
  });

  test("sign out redirects to home page", async ({ authenticatedPage }) => {
    // Click the sign-out button
    await authenticatedPage.click('button:has-text("Allgofnodi")');

    // Should be redirected to the home page
    await authenticatedPage.waitForURL("/", { timeout: 10_000 });
    await expect(authenticatedPage).toHaveURL(/^http:\/\/localhost:\d+\/?$/);
  });
});
