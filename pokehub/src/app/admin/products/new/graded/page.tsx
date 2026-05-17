import { AdminShell } from "~/app/_components/editorial/AdminShell";
import { NewGradedForm } from "~/app/admin/products/new/graded/NewGradedForm";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export default async function NewGradedCardPage() {
  const session = await auth();
  const pendingOrders = await db.order.count({ where: { status: "PAID" } });

  return (
    <AdminShell
      active="products"
      email={session?.user?.email ?? null}
      pendingOrders={pendingOrders}
    >
      <NewGradedForm />
    </AdminShell>
  );
}
