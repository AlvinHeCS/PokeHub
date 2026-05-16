"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";

import { db } from "~/server/db";

const signupSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").max(100),
    email: z.string().trim().toLowerCase().email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    marketingOptIn: z.boolean().default(false),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type SignupInput = z.input<typeof signupSchema>;
export type SignupResult =
  | { ok: true }
  | { ok: false; error: string; field?: keyof SignupInput };

export async function signupAction(input: SignupInput): Promise<SignupResult> {
  const parsed = signupSchema.safeParse(input);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return {
      ok: false,
      error: first?.message ?? "Invalid input",
      field: first?.path[0] as keyof SignupInput | undefined,
    };
  }
  const { name, email, password, marketingOptIn } = parsed.data;

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return {
      ok: false,
      error: "An account with this email already exists.",
      field: "email",
    };
  }

  const hashed = await bcrypt.hash(password, 10);
  await db.user.create({
    data: {
      name,
      email,
      password: hashed,
      marketingOptIn,
    },
  });

  return { ok: true };
}
