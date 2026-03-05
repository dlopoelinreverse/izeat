"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useTableOrders } from "@/hooks/use-table-orders";
import { StatusPill } from "./status-pill";
import { MenuStatusDrawer } from "./menu-status-drawer";

interface MenuCategoryHeaderProps {
  restaurantId: string;
  categoryName: string;
}

export function MenuCategoryHeader({
  restaurantId,
  categoryName,
}: MenuCategoryHeaderProps) {
  const searchParams = useSearchParams();
  const tableId = searchParams.get("table") ?? null;
  const tableNum = searchParams.get("tableNum");
  const cart = searchParams.get("cart");

  const [statusOpen, setStatusOpen] = useState(false);
  const { waiterCall, foodOrder } = useTableOrders(restaurantId, tableId);

  const backParams = new URLSearchParams();
  if (tableId) backParams.set("table", tableId);
  if (tableNum) backParams.set("tableNum", tableNum);
  if (cart) backParams.set("cart", cart);
  const backQuery = backParams.toString();
  const backHref = `/menu/${restaurantId}${backQuery ? `?${backQuery}` : ""}`;

  return (
    <>
      <header
        className="sticky top-0 z-10 bg-white border-b border-[rgba(26,23,20,0.06)]"
        style={{ boxShadow: "0 1px 4px rgba(26,23,20,0.06)" }}
      >
        <div className="px-4 py-3 flex items-center gap-3">
          <Link
            href={backHref}
            className="flex items-center justify-center size-8 rounded-full hover:bg-[#F7F4EF] transition-colors shrink-0"
            aria-label="Retour"
          >
            <ArrowLeft className="h-4 w-4 text-[#1A1714]" />
          </Link>

          <span
            className="flex-1 font-semibold text-[17px] text-[#1A1714] truncate"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {categoryName}
          </span>

          <StatusPill
            waiterCall={waiterCall}
            foodOrder={foodOrder}
            onClick={() => setStatusOpen(true)}
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
