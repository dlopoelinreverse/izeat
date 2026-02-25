"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { BellRing, CheckCheck } from "lucide-react";
import type { Order, Table } from "@/types/service-types";

interface WaiterCallSheetProps {
  open: boolean;
  onClose: () => void;
  orders: Order[];
  tables: Table[];
  onResolve: (orderId: string) => void;
  loading: boolean;
}

export function WaiterCallSheet({
  open,
  onClose,
  orders,
  tables,
  onResolve,
  loading,
}: WaiterCallSheetProps) {
  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-sm flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <BellRing className="h-5 w-5 text-destructive" />
            Appels serveur
            {orders.length > 0 && (
              <span className="ml-1 inline-flex items-center justify-center h-5 min-w-5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold px-1">
                {orders.length}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto mt-4 space-y-3">
          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
              <CheckCheck className="h-10 w-10 mb-3 opacity-30" />
              <p className="font-medium">Aucun appel en attente</p>
            </div>
          ) : (
            orders.map((order) => {
              const table = tables.find((t) => t.id === order?.tableId);
              return (
                <div
                  key={order?.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-lg border bg-card"
                >
                  <div className="space-y-0.5 min-w-0">
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
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={loading}
                    onClick={() => order?.id && onResolve(order.id)}
                  >
                    Résoudre
                  </Button>
                </div>
              );
            })
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
