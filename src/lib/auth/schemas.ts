import { z } from "zod/v4";

export const SignUpSchema = z.object({
  full_name: z
    .string()
    .min(2, "Mae angen o leiaf 2 gymeriad / At least 2 characters required")
    .max(100)
    .trim(),
  email: z.string().trim().email("Cyfeiriad e-bost annilys / Invalid email address"),
});

export const MagicLinkSchema = z.object({
  email: z.string().trim().email("Cyfeiriad e-bost annilys / Invalid email address"),
});

export const UpdateProfileSchema = z.object({
  full_name: z
    .string()
    .min(2, "Mae angen o leiaf 2 gymeriad / At least 2 characters required")
    .max(100)
    .trim(),
  postcode: z
    .string()
    .max(10)
    .trim()
    .optional()
    .transform((v) => v || null),
});

export type AuthFormState =
  | {
      errors?: Record<string, string[]>;
      message?: string;
    }
  | undefined;
