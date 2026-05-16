"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function PendingPaymentRefresher() {
  const router = useRouter();

  useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => {
      if (Date.now() - start > 30_000) {
        clearInterval(id);
        return;
      }
      router.refresh();
    }, 2_000);
    return () => clearInterval(id);
  }, [router]);

  return null;
}
