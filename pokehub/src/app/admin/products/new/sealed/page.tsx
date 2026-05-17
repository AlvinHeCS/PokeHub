import { AdminShell } from "~/app/_components/editorial/AdminShell";
import { NewSealedForm } from "~/app/admin/products/new/sealed/NewSealedForm";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export default async function NewSealedPage() {
  const session = await auth();
  const pendingOrders = await db.order.count({ where: { status: "PAID" } });

  return (
    <AdminShell
      active="products"
      email={session?.user?.email ?? null}
      pendingOrders={pendingOrders}
    >
      <NewSealedForm />
    </AdminShell>
  );
}
