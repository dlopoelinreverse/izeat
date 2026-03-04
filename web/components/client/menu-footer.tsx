"use client";

import { useState } from "react";
import { ShoppingCartIcon } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { useMenuOrder } from "@/contexts/menu-order-context";
import { useTableOrders } from "@/hooks/use-table-orders";
import { WaiterCallButton } from "./waiter-call-button";
import { OrderStatusButton } from "./order-status-button";
import { TableOrderDrawer } from "./table-order-drawer";

export function MenuFooter() {
  const params = useParams();
  const searchParams = useSearchParams();
  const restaurantId = params.restaurantId as string;
  const tableId = searchParams.get("table") ?? null;

  const [cartOpen, setCartOpen] = useState(false);
  const { totalCount, totalPrice } = useMenuOrder();
  const { waiterCall, foodOrder } = useTableOrders(restaurantId, tableId);

  const hasStatus = !!waiterCall || !!foodOrder;

  return (
    <>
      <footer className="sticky bottom-0 z-10 border-t bg-background/95 backdrop-blur">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <WaiterCallButton
              restaurantId={restaurantId}
              tableId={tableId}
              waiterCall={waiterCall}
            />
            {hasStatus && (
              <OrderStatusButton
                restaurantId={restaurantId}
                tableId={tableId}
                waiterCall={waiterCall}
                foodOrder={foodOrder}
              />
            )}
          </div>

          {totalCount > 0 && (
            <button
              onClick={() => setCartOpen(true)}
              className="flex items-center gap-2 bg-primary text-primary-foreground
                         rounded-full px-4 py-1.5 text-sm font-semibold
                         hover:bg-primary/90 transition-colors
                         animate-in fade-in slide-in-from-right-4 duration-300"
            >
              <ShoppingCartIcon className="h-4 w-4" />
              <span
                key={totalCount}
                className="bg-primary-foreground/20 rounded-full px-1.5 py-0.5
                           text-xs font-bold leading-none
                           animate-in zoom-in-75 duration-150"
              >
                {totalCount}
              </span>
              <span
                key={totalPrice.toFixed(2)}
                className="tabular-nums animate-in fade-in duration-150"
              >
                {totalPrice.toFixed(2)} €
              </span>
            </button>
          )}
        </div>
      </footer>

      <TableOrderDrawer
        restaurantId={restaurantId}
        tableId={tableId}
        open={cartOpen}
        onClose={() => setCartOpen(false)}
      />
    </>
  );
}
