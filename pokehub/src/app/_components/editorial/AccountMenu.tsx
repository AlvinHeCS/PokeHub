"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

import { I, Icon } from "~/app/_components/editorial/placeholders";

export function AccountMenu({
  signedIn,
  email,
  isAdmin,
}: {
  signedIn: boolean;
  email: string | null;
  isAdmin: boolean;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          background: "transparent",
          border: 0,
          color: "var(--ink-soft)",
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: 14,
          cursor: "pointer",
          padding: 0,
        }}
      >
        <Icon d={I.user} size={16} /> Account
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 10px)",
            right: 0,
            minWidth: 220,
            background: "var(--paper)",
            border: "1px solid var(--line)",
            borderRadius: 6,
            boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
            padding: 8,
            zIndex: 20,
          }}
        >
          {signedIn ? (
            <>
              {email && (
                <div
                  style={{
                    padding: "8px 12px",
                    fontSize: 12,
                    color: "var(--ink-mute)",
                    borderBottom: "1px solid var(--line-soft)",
                    marginBottom: 4,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {email}
                </div>
              )}
              {isAdmin && (
                <MenuLink href="/admin" onClick={() => setOpen(false)}>
                  Admin
                </MenuLink>
              )}
              <MenuLink href="/orders" onClick={() => setOpen(false)}>
                Orders
              </MenuLink>
              <MenuButton
                onClick={() => {
                  setOpen(false);
                  void signOut({ callbackUrl: "/signin" });
                }}
              >
                Sign out
              </MenuButton>
            </>
          ) : (
            <>
              <MenuLink href="/signin" onClick={() => setOpen(false)}>
                Sign in
              </MenuLink>
              <MenuLink href="/signup" onClick={() => setOpen(false)}>
                Create account
              </MenuLink>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function MenuLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      style={{
        display: "block",
        padding: "8px 12px",
        fontSize: 13,
        color: "var(--ink)",
        textDecoration: "none",
        borderRadius: 4,
      }}
      className="account-menu-item"
    >
      {children}
    </Link>
  );
}

function MenuButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "block",
        width: "100%",
        textAlign: "left",
        padding: "8px 12px",
        fontSize: 13,
        color: "var(--ink)",
        background: "transparent",
        border: 0,
        borderRadius: 4,
        cursor: "pointer",
      }}
      className="account-menu-item"
    >
      {children}
    </button>
  );
}
