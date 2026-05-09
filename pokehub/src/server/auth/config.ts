import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { env } from "~/env";
import { db } from "~/server/db";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: "USER" | "ADMIN";
    } & DefaultSession["user"];
  }
}

const adminEmails = new Set(
  env.ADMIN_EMAILS.split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean),
);

export const authConfig = {
  providers: [
    GoogleProvider({
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
    }),
  ],
  adapter: PrismaAdapter(db),
  callbacks: {
    session: async ({ session, user }) => {
      // Promote to ADMIN if email is in allowlist (idempotent)
      let role = (user as unknown as { role?: "USER" | "ADMIN" }).role ?? "USER";
      if (
        user.email &&
        adminEmails.has(user.email.toLowerCase()) &&
        role !== "ADMIN"
      ) {
        await db.user.update({
          where: { id: user.id },
          data: { role: "ADMIN" },
        });
        role = "ADMIN";
      }
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          role,
        },
      };
    },
  },
} satisfies NextAuthConfig;
