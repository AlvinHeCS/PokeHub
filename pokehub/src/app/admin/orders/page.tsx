import { AdminShell } from "~/app/_components/editorial/AdminShell";
import { AdminOrdersList } from "~/app/admin/orders/AdminOrdersList";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export default async function AdminOrdersPage() {
  const session = await auth();
  const pendingOrders = await db.order.count({ where: { status: "PAID" } });

  return (
    <AdminShell
      active="orders"
      email={session?.user?.email ?? null}
      pendingOrders={pendingOrders}
    >
      <AdminOrdersList />
    </AdminShell>
  );
}
