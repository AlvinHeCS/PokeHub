import { AdminShell } from "~/app/_components/editorial/AdminShell";
import { NewRawForm } from "~/app/admin/products/new/raw/NewRawForm";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export default async function NewRawCardPage() {
  const session = await auth();
  const pendingOrders = await db.order.count({ where: { status: "PAID" } });

  return (
    <AdminShell
      active="products"
      email={session?.user?.email ?? null}
      pendingOrders={pendingOrders}
    >
      <NewRawForm />
    </AdminShell>
  );
}
