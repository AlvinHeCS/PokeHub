"use client";

import { useState } from "react";

import { api } from "~/trpc/react";

export default function AdminProductsPage() {
  const [type, setType] = useState<"ALL" | "RAW" | "GRADED" | "SEALED">("ALL");
  const list = api.product.adminList.useQuery({
    type: type === "ALL" ? undefined : type,
    limit: 100,
  });

  const utils = api.useUtils();
  const update = api.product.update.useMutation({
    onSuccess: () => utils.product.adminList.invalidate(),
  });
  const delist = api.product.delist.useMutation({
    onSuccess: () => utils.product.adminList.invalidate(),
  });

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <select
          className="rounded border p-2"
          value={type}
          onChange={(e) =>
            setType(e.target.value as "ALL" | "RAW" | "GRADED" | "SEALED")
          }
        >
          <option value="ALL">All types</option>
          <option value="RAW">Raw</option>
          <option value="GRADED">Graded</option>
          <option value="SEALED">Sealed</option>
        </select>
      </div>

      {list.isLoading ? <div>Loading…</div> : null}

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="p-2">Type</th>
            <th className="p-2">Name</th>
            <th className="p-2">Variant</th>
            <th className="p-2">Price</th>
            <th className="p-2">Qty</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {list.data?.items.map((p) => {
            const name = p.card?.name ?? p.name ?? "—";
            const variant =
              p.type === "RAW"
                ? p.condition
                : p.type === "GRADED"
                  ? `${p.gradingCompany} ${p.grade?.toString() ?? ""}`
                  : (p.sealedType ?? "");
            return (
              <tr key={p.id} className="border-b">
                <td className="p-2">{p.type}</td>
                <td className="p-2">{name}</td>
                <td className="p-2">{variant}</td>
                <td className="p-2">${(p.priceCents / 100).toFixed(2)}</td>
                <td className="p-2">
                  <input
                    type="number"
                    min={0}
                    defaultValue={p.quantity}
                    onBlur={(e) => {
                      const newQty = parseInt(e.target.value, 10);
                      if (newQty !== p.quantity) {
                        update.mutate({ id: p.id, quantity: newQty });
                      }
                    }}
                    className="w-16 rounded border p-1"
                  />
                </td>
                <td className="p-2">
                  <button
                    type="button"
                    className="text-sm text-red-600 underline"
                    onClick={() => {
                      if (confirm("Delist this product?")) {
                        delist.mutate({ id: p.id });
                      }
                    }}
                  >
                    Delist
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {list.data?.items.length === 0 ? (
        <div className="mt-8 text-center text-gray-500">
          No products yet. Click &quot;+ Raw card&quot; / &quot;+ Graded
          card&quot; / &quot;+ Sealed product&quot; in the sidebar to start.
        </div>
      ) : null}
    </div>
  );
}
