"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTableOrders } from "@/hooks/use-table-orders";
import { StatusPill } from "./status-pill";
import { WaiterCallRow } from "./waiter-call-row";
import { MenuStatusDrawer } from "./menu-status-drawer";

interface MenuHomeHeaderProps {
  restaurantName: string;
  restaurantId: string;
}

export function MenuHomeHeader({
  restaurantName,
  restaurantId,
}: MenuHomeHeaderProps) {
  const searchParams = useSearchParams();
  const tableId = searchParams.get("table") ?? null;
  const tableNum = searchParams.get("tableNum");

  const [statusOpen, setStatusOpen] = useState(false);
  const { waiterCall, foodOrder } = useTableOrders(restaurantId, tableId);

  return (
    <>
      <header
        className="sticky top-0 z-10 bg-white border-b border-[rgba(26,23,20,0.06)]"
        style={{ boxShadow: "0 1px 4px rgba(26,23,20,0.06)" }}
      >
        {/* Row 1: restaurant name + status pill + table badge */}
        <div className="px-4 pt-4 pb-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[#C8963E] font-bold text-lg leading-none shrink-0">✦</span>
            <span
              className="font-semibold text-[18px] text-[#1A1714] truncate"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {restaurantName}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <StatusPill
              waiterCall={waiterCall}
              foodOrder={foodOrder}
              onClick={() => setStatusOpen(true)}
            />
            {tableNum && (
              <span className="bg-[#1A1714] text-white text-xs font-semibold px-3 py-1 rounded-full">
                Table {tableNum}
              </span>
            )}
          </div>
        </div>

        {/* Row 2: waiter call button */}
        <div className="px-4 pb-4">
          <WaiterCallRow
            restaurantId={restaurantId}
            tableId={tableId}
            waiterCall={waiterCall}
            onOpenStatus={() => setStatusOpen(true)}
          />
        </div>
      </header>

      <MenuStatusDrawer
        open={statusOpen}
        onClose={() => setStatusOpen(false)}
        restaurantId={restaurantId}
        tableId={tableId ?? ""}
        waiterCall={waiterCall}
        foodOrder={foodOrder}
      />
    </>
  );
}
