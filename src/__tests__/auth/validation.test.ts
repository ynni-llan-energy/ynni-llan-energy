import { SignUpSchema, SignInSchema, UpdateProfileSchema } from "@/lib/auth/schemas";

describe("SignUpSchema", () => {
  const valid = {
    full_name: "Siân Jones",
    email: "sian@example.com",
    password: "Secret123!",
  };

  it("accepts valid signup data", () => {
    const result = SignUpSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("rejects a full_name that is too short", () => {
    const result = SignUpSchema.safeParse({ ...valid, full_name: "S" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.full_name).toBeDefined();
    }
  });

  it("rejects an invalid email", () => {
    const result = SignUpSchema.safeParse({ ...valid, email: "not-an-email" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toBeDefined();
    }
  });

  it("rejects a password shorter than 8 characters", () => {
    const result = SignUpSchema.safeParse({ ...valid, password: "short" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.password).toBeDefined();
    }
  });

  it("trims whitespace from full_name and email", () => {
    const result = SignUpSchema.safeParse({
      ...valid,
      full_name: "  Siân Jones  ",
      email: "  sian@example.com  ",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.full_name).toBe("Siân Jones");
      expect(result.data.email).toBe("sian@example.com");
    }
  });
});

describe("SignInSchema", () => {
  const valid = { email: "sian@example.com", password: "anypassword" };

  it("accepts valid sign-in data", () => {
    expect(SignInSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects an empty password", () => {
    const result = SignInSchema.safeParse({ ...valid, password: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.password).toBeDefined();
    }
  });

  it("rejects an invalid email", () => {
    const result = SignInSchema.safeParse({ ...valid, email: "bad" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toBeDefined();
    }
  });
});

describe("UpdateProfileSchema", () => {
  it("accepts a full_name with optional postcode", () => {
    const result = UpdateProfileSchema.safeParse({
      full_name: "Dewi Llewelyn",
      postcode: "LL33 0AB",
    });
    expect(result.success).toBe(true);
  });

  it("coerces empty postcode to null", () => {
    const result = UpdateProfileSchema.safeParse({
      full_name: "Dewi Llewelyn",
      postcode: "",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.postcode).toBeNull();
    }
  });

  it("coerces missing postcode to null", () => {
    const result = UpdateProfileSchema.safeParse({ full_name: "Dewi Llewelyn" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.postcode).toBeNull();
    }
  });

  it("rejects a full_name that is too short", () => {
    const result = UpdateProfileSchema.safeParse({ full_name: "D", postcode: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.full_name).toBeDefined();
    }
  });
});
