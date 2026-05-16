"use client";

import Link from "next/link";

import { useCart } from "~/lib/cart";

export function Header({
  signedIn,
  email,
  isAdmin,
}: {
  signedIn: boolean;
  email: string | null;
  isAdmin: boolean;
}) {
  const lines = useCart((s) => s.lines);
  const open = useCart((s) => s.openDrawer);
  const itemCount = lines.reduce((s, l) => s + l.quantity, 0);

  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
        <Link href="/" className="text-xl font-bold">
          PokeHub
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/shop" className="hover:underline">
            Shop
          </Link>
          {isAdmin ? (
            <Link href="/admin" className="hover:underline">
              Admin
            </Link>
          ) : null}
          {signedIn ? (
            <span className="text-gray-600">{email}</span>
          ) : (
            <Link href="/signin" className="hover:underline">
              Sign in
            </Link>
          )}
          <button
            type="button"
            onClick={open}
            className="rounded border px-3 py-1 hover:bg-gray-50"
          >
            Cart ({itemCount})
          </button>
        </nav>
      </div>
    </header>
  );
}
