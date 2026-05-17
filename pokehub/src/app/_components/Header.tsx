"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { AccountMenu } from "~/app/_components/editorial/AccountMenu";
import { I, Icon } from "~/app/_components/editorial/placeholders";
import { useCart } from "~/lib/cart";

const NAV: { id: string; label: string; href: string }[] = [
  { id: "shop", label: "Shop", href: "/shop" },
  { id: "singles", label: "Singles", href: "/shop?type=singles" },
  { id: "graded", label: "Graded", href: "/shop?type=graded" },
  { id: "sealed", label: "Sealed", href: "/shop?type=sealed" },
];

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
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const typeParam = searchParams?.get("type");
  const active = pathname?.startsWith("/shop")
    ? typeParam === "singles" ||
      typeParam === "graded" ||
      typeParam === "sealed"
      ? typeParam
      : "shop"
    : null;

  return (
    <header
      style={{
        background: "var(--bg)",
        borderBottom: "1px solid var(--line)",
        padding: "18px 32px",
        display: "flex",
        alignItems: "center",
        gap: 28,
        position: "relative",
        zIndex: 5,
      }}
      className="editorial-header"
    >
      <Link
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          textDecoration: "none",
          color: "var(--ink)",
        }}
      >
        <span
          className="serif"
          style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.025em" }}
        >
          PokéHub
        </span>
      </Link>
      <nav
        style={{ display: "flex", gap: 24, fontSize: 14, marginLeft: 16 }}
        className="editorial-header-nav"
      >
        {NAV.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            style={{
              color: active === item.id ? "var(--ink)" : "var(--ink-soft)",
              textDecoration: "none",
              fontWeight: active === item.id ? 500 : 400,
              position: "relative",
              paddingBottom: 2,
              borderBottom:
                active === item.id
                  ? "1px solid var(--ink)"
                  : "1px solid transparent",
            }}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div
        style={{
          marginLeft: "auto",
          flex: "0 1 320px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "var(--paper)",
          border: "1px solid var(--line)",
          borderRadius: 6,
          padding: "8px 12px",
        }}
        className="editorial-header-search"
      >
        <Icon d={I.search} size={15} color="var(--ink-mute)" />
        <span style={{ fontSize: 13, color: "var(--ink-mute)" }}>
          Search 23,419 cards
        </span>
        <span
          className="mono"
          style={{
            marginLeft: "auto",
            fontSize: 10,
            color: "var(--ink-mute)",
            padding: "1px 5px",
            border: "1px solid var(--line)",
            borderRadius: 3,
          }}
        >
          ⌘K
        </span>
      </div>
      <AccountMenu signedIn={signedIn} email={email} isAdmin={isAdmin} />
      <button
        type="button"
        onClick={open}
        className="btn"
        style={{ padding: "9px 16px" }}
      >
        <Icon d={I.bag} size={15} />
        Bag · {itemCount}
      </button>
    </header>
  );
}

