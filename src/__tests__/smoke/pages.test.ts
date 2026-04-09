/**
 * Smoke tests — verify that key pages respond without errors.
 *
 * Runs against BASE_URL (default: http://localhost:3000).
 * In CI the build is started with `next start` before these run.
 * Against a Vercel preview: BASE_URL=https://your-preview.vercel.app npm run test:smoke
 *
 * These tests intentionally avoid any auth state so they're safe to run
 * against any environment without real credentials.
 */

const BASE_URL = (process.env.BASE_URL ?? "http://localhost:3000").replace(
  /\/$/,
  ""
);

/** Fetch a page following redirects, return final status + URL. */
async function get(path: string) {
  const res = await fetch(`${BASE_URL}${path}`, {
    redirect: "follow",
    headers: { "User-Agent": "smoke-test" },
  });
  return { status: res.status, url: res.url, ok: res.ok };
}

/** Fetch without following redirects, to assert the redirect itself. */
async function getNoRedirect(path: string) {
  const res = await fetch(`${BASE_URL}${path}`, {
    redirect: "manual",
    headers: { "User-Agent": "smoke-test" },
  });
  return {
    status: res.status,
    location: res.headers.get("location") ?? "",
  };
}

// ---------------------------------------------------------------------------
// Public pages — must return 200
// ---------------------------------------------------------------------------

describe("Public pages", () => {
  const publicPages = [
    { path: "/", name: "Homepage" },
    { path: "/ymuno", name: "Join / Signup" },
    { path: "/mewngofnodi", name: "Login" },
    { path: "/ymuno/diolch", name: "Post-signup thank you" },
    { path: "/am-ni", name: "About" },
    { path: "/prosiectau", name: "Projects" },
    { path: "/newyddion", name: "News" },
    { path: "/cysylltu", name: "Contact" },
  ];

  for (const { path, name } of publicPages) {
    it(`GET ${path} (${name}) returns 200`, async () => {
      const { status } = await get(path);
      expect(status).toBe(200);
    });
  }
});

// ---------------------------------------------------------------------------
// Protected pages — must redirect unauthenticated users to login, not 500
// ---------------------------------------------------------------------------

describe("Protected pages (unauthenticated)", () => {
  it("GET /aelodau redirects to /mewngofnodi when not logged in", async () => {
    const { status, location } = await getNoRedirect("/aelodau");
    // Next.js issues a 307 temporary redirect from middleware/layout
    expect([301, 302, 307, 308]).toContain(status);
    expect(location).toMatch(/mewngofnodi/);
  });
});

// ---------------------------------------------------------------------------
// API / infrastructure routes
// ---------------------------------------------------------------------------

describe("Infrastructure routes", () => {
  it("GET /auth/callback without a code returns a redirect (not 500)", async () => {
    // Without a code param it should redirect to login with an error flag,
    // not crash with a 500.
    const { status } = await getNoRedirect("/auth/callback");
    expect([301, 302, 307, 308]).toContain(status);
  });

  it("GET /_not-found returns 404", async () => {
    const { status } = await get("/this-page-definitely-does-not-exist");
    expect(status).toBe(404);
  });
});
