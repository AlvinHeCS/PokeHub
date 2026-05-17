import { AdminShell } from "~/app/_components/editorial/AdminShell";
import { AdminOrderDetail } from "~/app/admin/orders/[id]/AdminOrderDetail";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const pendingOrders = await db.order.count({ where: { status: "PAID" } });

  return (
    <AdminShell
      active="orders"
      email={session?.user?.email ?? null}
      pendingOrders={pendingOrders}
    >
      <AdminOrderDetail params={params} />
    </AdminShell>
  );
}
