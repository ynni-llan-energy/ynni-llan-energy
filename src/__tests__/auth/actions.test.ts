/**
 * Unit tests for auth server actions.
 *
 * Supabase and Next.js server-only APIs (cookies, redirect, headers) are
 * fully mocked so these tests run in CI without a live Supabase instance.
 */

// ---------------------------------------------------------------------------
// Mocks — must be declared before any imports that use the mocked modules
// ---------------------------------------------------------------------------

const mockSignInWithOtp = jest.fn();
const mockSignOut = jest.fn();
const mockGetUser = jest.fn();
const mockFrom = jest.fn();

jest.mock("@/lib/supabase/server", () => ({
  createClient: jest.fn().mockResolvedValue({
    auth: {
      signInWithOtp: mockSignInWithOtp,
      signOut: mockSignOut,
      getUser: mockGetUser,
    },
    from: mockFrom,
  }),
}));

// Capture redirect calls without throwing (redirect() throws in Next.js)
const mockRedirect = jest.fn();
jest.mock("next/navigation", () => ({
  redirect: (url: string) => {
    mockRedirect(url);
    // Simulate Next.js redirect by throwing so callers stop executing
    throw new Error(`NEXT_REDIRECT:${url}`);
  },
}));

jest.mock("next/headers", () => ({
  headers: jest.fn().mockResolvedValue({
    get: jest.fn().mockReturnValue("localhost:3000"),
  }),
  cookies: jest.fn().mockResolvedValue({
    getAll: jest.fn().mockReturnValue([]),
    set: jest.fn(),
  }),
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeFormData(entries: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [k, v] of Object.entries(entries)) fd.set(k, v);
  return fd;
}

function expectRedirectTo(url: string) {
  expect(mockRedirect).toHaveBeenCalledWith(
    expect.stringContaining(url)
  );
}

// ---------------------------------------------------------------------------
// Import under test (after mocks are set up)
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { signUp, requestMagicLink, signOut: doSignOut, updateProfile } = require("@/app/actions/auth");

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

beforeEach(() => {
  jest.clearAllMocks();
});

// ---- signUp ---------------------------------------------------------------

describe("signUp", () => {
  const validData = {
    full_name: "Siân Jones",
    email: "sian@example.com",
    policy_consent: "on",
  };

  it("returns field errors for invalid input", async () => {
    const fd = makeFormData({ full_name: "S", email: "bad" });
    const result = await signUp(undefined, fd);
    expect(result?.errors).toBeDefined();
    expect(result?.errors?.full_name).toBeDefined();
    expect(result?.errors?.email).toBeDefined();
    expect(mockSignInWithOtp).not.toHaveBeenCalled();
  });

  it("calls supabase.auth.signInWithOtp with correct args and redirects on success", async () => {
    mockSignInWithOtp.mockResolvedValue({ error: null });
    const fd = makeFormData(validData);
    await expect(signUp(undefined, fd)).rejects.toThrow("NEXT_REDIRECT");
    expect(mockSignInWithOtp).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "sian@example.com",
        options: expect.objectContaining({
          shouldCreateUser: true,
          data: expect.objectContaining({ full_name: "Siân Jones", policy_consent_at: expect.any(String) }),
        }),
      })
    );
    expectRedirectTo("/ymuno/diolch");
  });

  it("returns a message when supabase returns an error", async () => {
    mockSignInWithOtp.mockResolvedValue({
      error: { message: "Email rate limit exceeded" },
    });
    const fd = makeFormData(validData);
    const result = await signUp(undefined, fd);
    expect(result?.message).toBe("Email rate limit exceeded");
  });
});

// ---- requestMagicLink -----------------------------------------------------

describe("requestMagicLink", () => {
  it("returns field errors for invalid email", async () => {
    const fd = makeFormData({ email: "bad" });
    const result = await requestMagicLink(undefined, fd);
    expect(result?.errors?.email).toBeDefined();
    expect(mockSignInWithOtp).not.toHaveBeenCalled();
  });

  it("calls signInWithOtp with shouldCreateUser:false and returns sent", async () => {
    mockSignInWithOtp.mockResolvedValue({ error: null });
    const fd = makeFormData({ email: "sian@example.com" });
    const result = await requestMagicLink(undefined, fd);
    expect(mockSignInWithOtp).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "sian@example.com",
        options: expect.objectContaining({ shouldCreateUser: false }),
      })
    );
    expect(result?.message).toBe("sent");
  });

  it("returns a message when supabase returns an error", async () => {
    mockSignInWithOtp.mockResolvedValue({
      error: { message: "Invalid redirect URL" },
    });
    const fd = makeFormData({ email: "sian@example.com" });
    const result = await requestMagicLink(undefined, fd);
    expect(result?.message).toBe("Invalid redirect URL");
  });
});

// ---- signOut --------------------------------------------------------------

describe("signOut", () => {
  it("calls supabase.auth.signOut and redirects to home", async () => {
    mockSignOut.mockResolvedValue({ error: null });
    await expect(doSignOut()).rejects.toThrow("NEXT_REDIRECT");
    expect(mockSignOut).toHaveBeenCalled();
    expectRedirectTo("/");
  });
});

// ---- updateProfile --------------------------------------------------------

describe("updateProfile", () => {
  const validData = { full_name: "Dewi Llewelyn", postcode: "LL33 0AB" };

  it("returns field errors for invalid input", async () => {
    const fd = makeFormData({ full_name: "D", postcode: "" });
    mockGetUser.mockResolvedValue({ data: { user: { id: "abc" } } });
    const result = await updateProfile(undefined, fd);
    expect(result?.errors?.full_name).toBeDefined();
  });

  it("redirects to login if no user session", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });
    const fd = makeFormData(validData);
    await expect(updateProfile(undefined, fd)).rejects.toThrow("NEXT_REDIRECT");
    expectRedirectTo("/mewngofnodi");
  });

  it("calls supabase update and returns success message", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "abc" } } });
    const mockUpdate = jest.fn().mockReturnValue({
      eq: jest.fn().mockResolvedValue({ error: null }),
    });
    mockFrom.mockReturnValue({ update: mockUpdate });

    const fd = makeFormData(validData);
    const result = await updateProfile(undefined, fd);
    expect(result?.message).toBe("success");
    expect(mockUpdate).toHaveBeenCalledWith({
      full_name: "Dewi Llewelyn",
      postcode: "LL33 0AB",
    });
  });

  it("returns error message when supabase update fails", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "abc" } } });
    const mockUpdate = jest.fn().mockReturnValue({
      eq: jest.fn().mockResolvedValue({ error: { message: "DB error" } }),
    });
    mockFrom.mockReturnValue({ update: mockUpdate });

    const fd = makeFormData(validData);
    const result = await updateProfile(undefined, fd);
    expect(result?.message).toMatch(/Methwyd|failed/);
  });
});
