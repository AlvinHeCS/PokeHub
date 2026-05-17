import { AdminShell } from "~/app/_components/editorial/AdminShell";
import { AdminProductsList } from "~/app/admin/products/AdminProductsList";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export default async function AdminProductsPage() {
  const session = await auth();
  const pendingOrders = await db.order.count({ where: { status: "PAID" } });

  return (
    <AdminShell
      active="products"
      email={session?.user?.email ?? null}
      pendingOrders={pendingOrders}
    >
      <AdminProductsList />
    </AdminShell>
  );
}
