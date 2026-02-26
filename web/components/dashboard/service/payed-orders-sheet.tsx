"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CheckCheck, Receipt } from "lucide-react";
import type { Order, Table } from "@/types/service-types";

interface PayedOrdersSheetProps {
  open: boolean;
  onClose: () => void;
  orders: Order[];
  tables: Table[];
}

export function PayedOrdersSheet({
  open,
  onClose,
  orders,
  tables,
}: PayedOrdersSheetProps) {
  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-sm flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-green-600" />
            Commandes réglées
            {orders.length > 0 && (
              <span className="ml-1 inline-flex items-center justify-center h-5 min-w-5 rounded-full bg-green-600 text-white text-[10px] font-bold px-1">
                {orders.length}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto mt-4 space-y-3">
          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
              <CheckCheck className="h-10 w-10 mb-3 opacity-30" />
              <p className="font-medium">Aucune commande réglée</p>
            </div>
          ) : (
            orders.map((order) => {
              const table = tables.find((t) => t.id === order?.tableId);
              const items = order?.items ?? [];
              const total = items.reduce(
                (acc, i) => acc + (i?.price ?? 0) * (i?.qty ?? 0),
                0,
              );
              return (
                <div
                  key={order?.id}
                  className="flex flex-col gap-2 p-3 rounded-lg border bg-card"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm">
                      Table{" "}
                      <span className="text-primary">
                        {table?.number ?? order?.tableId}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order?.createdAt &&
                        new Date(order.createdAt).toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                    </p>
                  </div>
                  {items.length > 0 && (
                    <div className="flex flex-col gap-1">
                      {items.map((item) => (
                        <div
                          key={item?.id}
                          className="flex items-center justify-between text-xs text-muted-foreground"
                        >
                          <span>
                            {item?.qty} × {item?.name}
                          </span>
                          <span>
                            {((item?.price ?? 0) * (item?.qty ?? 0)).toFixed(2)}{" "}
                            €
                          </span>
                        </div>
                      ))}
                      <div className="flex items-center justify-between text-sm font-semibold border-t pt-1 mt-1">
                        <span>Total</span>
                        <span className="text-green-600">
                          {total.toFixed(2)} €
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
