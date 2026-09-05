/**
 * Unit tests for auth server actions.
 *
 * Auth.js, Drizzle, and Next.js server-only APIs (redirect) are fully mocked
 * so these tests run in CI without a live Postgres instance.
 */

// ---------------------------------------------------------------------------
// Mocks — must be declared before any imports that use the mocked modules
// ---------------------------------------------------------------------------

const mockAuthSignIn = jest.fn();
const mockAuthSignOut = jest.fn();
const mockAuth = jest.fn();

class MockAuthError extends Error {
  type = "EmailSignInError";
}

jest.mock("next-auth", () => ({
  AuthError: MockAuthError,
}));

jest.mock("@/lib/auth", () => ({
  auth: (...args: unknown[]) => mockAuth(...args),
  signIn: (...args: unknown[]) => mockAuthSignIn(...args),
  signOut: (...args: unknown[]) => mockAuthSignOut(...args),
}));

const mockDbInsertValues = jest.fn();
const mockDbInsertOnConflictDoNothing = jest.fn();
const mockDbInsertReturning = jest.fn();
const mockDbUpdateSet = jest.fn();
const mockDbUpdateWhere = jest.fn();
const mockDbQueryUsersFindFirst = jest.fn();

jest.mock("@/lib/db", () => ({
  db: {
    insert: jest.fn(() => ({
      values: mockDbInsertValues,
    })),
    update: jest.fn(() => ({
      set: mockDbUpdateSet,
    })),
    query: {
      users: {
        findFirst: (...args: unknown[]) => mockDbQueryUsersFindFirst(...args),
      },
    },
  },
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
  // insert(...).values(...).onConflictDoNothing(...).returning() chain
  mockDbInsertValues.mockReturnValue({
    onConflictDoNothing: mockDbInsertOnConflictDoNothing,
  });
  mockDbInsertOnConflictDoNothing.mockReturnValue({
    returning: mockDbInsertReturning,
  });
  mockDbInsertReturning.mockResolvedValue([]);
  // update(...).set(...).where(...) chain
  mockDbUpdateSet.mockReturnValue({ where: mockDbUpdateWhere });
  mockDbUpdateWhere.mockResolvedValue(undefined);
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
    expect(mockAuthSignIn).not.toHaveBeenCalled();
  });

  it("creates the user/member rows and sends the magic link on success", async () => {
    // No existing user row for this email — fresh signup
    mockDbInsertReturning.mockResolvedValue([{ id: "new-user-id", email: validData.email }]);
    mockAuthSignIn.mockResolvedValue(undefined);

    const fd = makeFormData(validData);
    await expect(signUp(undefined, fd)).rejects.toThrow("NEXT_REDIRECT");

    expect(mockDbInsertValues).toHaveBeenCalledWith(
      expect.objectContaining({ email: "sian@example.com" })
    );
    expect(mockAuthSignIn).toHaveBeenCalledWith(
      "resend",
      expect.objectContaining({ email: "sian@example.com", redirect: false })
    );
    expectRedirectTo("/ymuno/diolch");
  });

  it("returns a message when Auth.js sign-in fails", async () => {
    mockDbInsertReturning.mockResolvedValue([{ id: "new-user-id", email: validData.email }]);
    mockAuthSignIn.mockRejectedValue(new MockAuthError("send failed"));

    const fd = makeFormData(validData);
    const result = await signUp(undefined, fd);
    expect(result?.message).toMatch(/Methwyd|Failed/);
  });
});

// ---- requestMagicLink -----------------------------------------------------

describe("requestMagicLink", () => {
  it("returns field errors for invalid email", async () => {
    const fd = makeFormData({ email: "bad" });
    const result = await requestMagicLink(undefined, fd);
    expect(result?.errors?.email).toBeDefined();
    expect(mockAuthSignIn).not.toHaveBeenCalled();
  });

  it("returns a message when no account exists for the email", async () => {
    mockDbQueryUsersFindFirst.mockResolvedValue(undefined);

    const fd = makeFormData({ email: "sian@example.com" });
    const result = await requestMagicLink(undefined, fd);

    expect(mockAuthSignIn).not.toHaveBeenCalled();
    expect(result?.message).toMatch(/Ni chanfuwyd|No account found/);
  });

  it("sends the magic link and returns sent for an existing account", async () => {
    mockDbQueryUsersFindFirst.mockResolvedValue({ id: "existing-id", email: "sian@example.com" });
    mockAuthSignIn.mockResolvedValue(undefined);

    const fd = makeFormData({ email: "sian@example.com" });
    const result = await requestMagicLink(undefined, fd);

    expect(mockAuthSignIn).toHaveBeenCalledWith(
      "resend",
      expect.objectContaining({ email: "sian@example.com", redirect: false })
    );
    expect(result?.message).toBe("sent");
  });

  it("returns a message when Auth.js sign-in fails", async () => {
    mockDbQueryUsersFindFirst.mockResolvedValue({ id: "existing-id", email: "sian@example.com" });
    mockAuthSignIn.mockRejectedValue(new MockAuthError("send failed"));

    const fd = makeFormData({ email: "sian@example.com" });
    const result = await requestMagicLink(undefined, fd);
    expect(result?.message).toMatch(/Methwyd|Failed/);
  });
});

// ---- signOut --------------------------------------------------------------

describe("signOut", () => {
  it("calls Auth.js signOut with a redirect to home", async () => {
    mockAuthSignOut.mockResolvedValue(undefined);
    await doSignOut();
    expect(mockAuthSignOut).toHaveBeenCalledWith(
      expect.objectContaining({ redirectTo: "/" })
    );
  });
});

// ---- updateProfile --------------------------------------------------------

describe("updateProfile", () => {
  const validData = { full_name: "Dewi Llewelyn", postcode: "LL33 0AB" };

  it("returns field errors for invalid input", async () => {
    const fd = makeFormData({ full_name: "D", postcode: "" });
    mockAuth.mockResolvedValue({ user: { id: "abc" } });
    const result = await updateProfile(undefined, fd);
    expect(result?.errors?.full_name).toBeDefined();
  });

  it("redirects to login if no session", async () => {
    mockAuth.mockResolvedValue(null);
    const fd = makeFormData(validData);
    await expect(updateProfile(undefined, fd)).rejects.toThrow("NEXT_REDIRECT");
    expectRedirectTo("/mewngofnodi");
  });

  it("calls db update and returns success message", async () => {
    mockAuth.mockResolvedValue({ user: { id: "abc" } });

    const fd = makeFormData(validData);
    const result = await updateProfile(undefined, fd);
    expect(result?.message).toBe("success");
    expect(mockDbUpdateSet).toHaveBeenCalledWith({
      fullName: "Dewi Llewelyn",
      postcode: "LL33 0AB",
    });
  });

  it("returns error message when db update fails", async () => {
    mockAuth.mockResolvedValue({ user: { id: "abc" } });
    mockDbUpdateWhere.mockRejectedValue(new Error("DB error"));

    const fd = makeFormData(validData);
    const result = await updateProfile(undefined, fd);
    expect(result?.message).toMatch(/Methwyd|failed/);
  });
});
