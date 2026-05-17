"use client";

import { signOut } from "next-auth/react";

export function ClientSignOut() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/signin" })}
      style={{
        marginTop: 8,
        background: "transparent",
        border: 0,
        color: "var(--accent)",
        fontSize: 11,
        padding: 0,
        cursor: "pointer",
        textDecoration: "underline",
      }}
    >
      Sign out
    </button>
  );
}
