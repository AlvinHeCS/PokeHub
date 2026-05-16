import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "~/server/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/api/auth/signin?callbackUrl=/admin");
  if (session.user.role !== "ADMIN") redirect("/");

  return (
    <div className="flex min-h-screen">
      <aside className="w-56 border-r bg-gray-50 p-4">
        <Link href="/" className="mb-6 block text-lg font-bold">
          PokeHub
        </Link>
        <nav className="flex flex-col gap-1 text-sm">
          <Link className="rounded p-2 hover:bg-gray-200" href="/admin">
            Dashboard
          </Link>
          <Link
            className="rounded p-2 hover:bg-gray-200"
            href="/admin/products"
          >
            Products
          </Link>
          <Link
            className="rounded p-2 hover:bg-gray-200"
            href="/admin/products/new/raw"
          >
            + Raw card
          </Link>
          <Link
            className="rounded p-2 hover:bg-gray-200"
            href="/admin/products/new/graded"
          >
            + Graded card
          </Link>
          <Link
            className="rounded p-2 hover:bg-gray-200"
            href="/admin/products/new/sealed"
          >
            + Sealed product
          </Link>
          <Link className="rounded p-2 hover:bg-gray-200" href="/admin/orders">
            Orders
          </Link>
        </nav>
        <div className="mt-8 border-t pt-4 text-xs text-gray-600">
          {session.user.email}
          <br />
          <Link href="/api/auth/signout" className="underline">
            Sign out
          </Link>
        </div>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
