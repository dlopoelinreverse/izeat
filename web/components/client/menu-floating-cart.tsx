"use client";

import { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useMenuOrder } from "@/contexts/menu-order-context";
import { TableOrderDrawer } from "./table-order-drawer";

export function MenuFloatingCart() {
  const params = useParams();
  const searchParams = useSearchParams();
  const restaurantId = params.restaurantId as string;
  const tableId = searchParams.get("table") ?? null;

  const [cartOpen, setCartOpen] = useState(false);
  const { totalCount, totalPrice } = useMenuOrder();

  if (totalCount === 0) return null;

  return (
    <>
      {/* Gradient fade at bottom */}
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm h-24 pointer-events-none z-10"
        style={{ background: "linear-gradient(to top, #F7F4EF 40%, transparent)" }}
      />

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm px-4 pb-5 z-20 pointer-events-none">
        <button
          onClick={() => setCartOpen(true)}
          className="pointer-events-auto w-full flex items-center justify-between px-5 py-4 rounded-[14px]
                     bg-[#1A1714] text-white transition-transform duration-200 active:scale-[0.98]"
          style={{ boxShadow: "0 4px 20px rgba(26,23,20,0.3)" }}
        >
          <div className="flex items-center gap-3">
            <span
              className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#C8963E] text-white text-xs font-bold shrink-0"
              key={totalCount}
            >
              {totalCount}
            </span>
            <span className="text-sm font-medium">Voir ma commande</span>
          </div>
          <span className="text-sm font-semibold tabular-nums" key={totalPrice.toFixed(2)}>
            {totalPrice.toFixed(2)} €
          </span>
        </button>
      </div>

      <TableOrderDrawer
        restaurantId={restaurantId}
        tableId={tableId}
        open={cartOpen}
        onClose={() => setCartOpen(false)}
      />
    </>
  );
}
