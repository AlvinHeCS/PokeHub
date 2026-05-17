import Link from "next/link";

import { ClientSignOut } from "~/app/_components/editorial/ClientSignOut";
import { I, Icon } from "~/app/_components/editorial/placeholders";

export type AdminNavId = "dashboard" | "products" | "orders";

const NAV: {
  id: AdminNavId;
  label: string;
  href: string;
  icon: string | readonly string[];
}[] = [
  { id: "dashboard", label: "Dashboard", href: "/admin", icon: I.spark },
  { id: "products", label: "Products", href: "/admin/products", icon: I.bag },
  { id: "orders", label: "Orders", href: "/admin/orders", icon: I.truck },
];

const QUICK_LIST: {
  label: string;
  href: string;
  highlight?: boolean;
}[] = [
  { label: "+ List raw card", href: "/admin/products/new/raw" },
  { label: "+ List graded card", href: "/admin/products/new/graded" },
  {
    label: "+ List sealed",
    href: "/admin/products/new/sealed",
    highlight: true,
  },
];

export function AdminShell({
  active,
  email,
  pendingOrders,
  children,
}: {
  active: AdminNavId;
  email: string | null;
  pendingOrders: number;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "240px 1fr",
        background: "var(--bg)",
        minHeight: "calc(100vh - 65px)",
      }}
      className="admin-shell"
    >
      <aside
        style={{
          background: "var(--paper)",
          borderRight: "1px solid var(--line)",
          padding: "22px 16px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "0 8px 18px",
            borderBottom: "1px solid var(--line-soft)",
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              background: "var(--ink)",
              color: "var(--bg)",
              borderRadius: 6,
              display: "grid",
              placeItems: "center",
              fontFamily: "var(--serif)",
              fontStyle: "italic",
              fontWeight: 600,
              fontSize: 16,
              letterSpacing: "-0.04em",
            }}
          >
            P
          </div>
          <div>
            <div
              className="serif"
              style={{ fontSize: 17, fontWeight: 500, lineHeight: 1 }}
            >
              PokéHub
            </div>
            <div
              className="mono"
              style={{
                fontSize: 10,
                color: "var(--ink-mute)",
                letterSpacing: "0.1em",
                marginTop: 4,
              }}
            >
              ADMIN
            </div>
          </div>
        </div>

        <div
          className="eyebrow"
          style={{ marginTop: 18, padding: "0 8px", fontSize: 10 }}
        >
          Main
        </div>
        <nav
          style={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {NAV.map((item) => {
            const isActive = item.id === active;
            return (
              <Link
                key={item.id}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 10px",
                  borderRadius: 4,
                  fontSize: 13,
                  background: isActive ? "var(--bg-alt)" : "transparent",
                  color: isActive ? "var(--ink)" : "var(--ink-soft)",
                  fontWeight: isActive ? 500 : 400,
                  textDecoration: "none",
                }}
              >
                <Icon d={item.icon} size={15} />
                {item.label}
                {item.id === "orders" && pendingOrders > 0 ? (
                  <span
                    className="pill"
                    style={{
                      marginLeft: "auto",
                      background: "var(--accent)",
                      color: "var(--ink-accent)",
                      border: 0,
                      fontSize: 10,
                      padding: "2px 8px",
                    }}
                  >
                    {pendingOrders}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div
          className="eyebrow"
          style={{ marginTop: 22, padding: "0 8px", fontSize: 10 }}
        >
          Quick list
        </div>
        <nav
          style={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {QUICK_LIST.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              style={{
                padding: "9px 10px",
                borderRadius: 4,
                fontSize: 13,
                color: item.highlight ? "var(--ink-accent)" : "var(--ink-soft)",
                background: item.highlight ? "var(--accent)" : "transparent",
                fontWeight: item.highlight ? 500 : 400,
                textDecoration: "none",
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div
          style={{
            marginTop: "auto",
            padding: 12,
            background: "var(--bg-alt)",
            borderRadius: 6,
            fontSize: 12,
            color: "var(--ink-soft)",
            border: "1px solid var(--line-soft)",
          }}
        >
          <div className="eyebrow" style={{ fontSize: 9 }}>
            Signed in
          </div>
          <div
            style={{
              marginTop: 4,
              color: "var(--ink)",
              fontWeight: 500,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {email ?? "—"}
          </div>
          <div style={{ marginTop: 2, fontSize: 11 }}>Admin</div>
          <ClientSignOut />
        </div>
      </aside>
      <main style={{ padding: 32, overflow: "auto", minWidth: 0 }}>
        {children}
      </main>
    </div>
  );
}
