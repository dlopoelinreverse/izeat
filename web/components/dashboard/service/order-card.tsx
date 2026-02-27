"use client";

import { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed } from "lucide-react";
import {
  type Order,
  type Status,
  type Table,
  STATUS_NEXT,
  STATUS_NEXT_LABEL,
} from "../../../types/service-types";
import { PayAction, type PayActionHandle } from "./pay-action";

interface OrderCardProps {
  order: Order;
  table: Table | undefined;
  onAdvance: (orderId: string, status: Status) => void;
  onPay: (orderId: string) => void;
  loading: boolean;
}

export function OrderCard({
  order,
  table,
  onAdvance,
  onPay,
  loading,
}: OrderCardProps) {
  const [open, setOpen] = useState(false);
  const payRef = useRef<PayActionHandle>(null);

  const status = order?.status as Status;
  const nextStatus = STATUS_NEXT[status];
  const nextLabel = STATUS_NEXT_LABEL[status];
  const items = order?.items ?? [];
  const itemCount = items.reduce((acc, i) => acc + (i?.qty ?? 0), 0);
  const total = items.reduce(
    (acc, i) => acc + (i?.price ?? 0) * (i?.qty ?? 0),
    0,
  );
  const time = new Date(order?.createdAt).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <>
      {/* Compact card */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => e.key === "Enter" && setOpen(true)}
        className="cursor-pointer flex flex-col gap-1 p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors select-none"
      >
        <p className="font-semibold text-sm">
          Table{" "}
          <span className="text-primary">{table?.number ?? order?.tableId}</span>
        </p>
        <p className="text-xs text-muted-foreground">{time}</p>
        <p className="text-xs text-muted-foreground">
          {itemCount > 0
            ? `${itemCount} plat${itemCount > 1 ? "s" : ""}`
            : "Aucun plat"}
        </p>
        {status === "served" && total > 0 && (
          <p className="text-xs font-semibold text-green-600">
            {total.toFixed(2)} €
          </p>
        )}
      </div>

      {/* Detail dialog */}
      <Dialog
        open={open}
        onOpenChange={(v) => {
          if (!v) payRef.current?.cancel();
          setOpen(v);
        }}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>
              Table {table?.number ?? order?.tableId}
            </DialogTitle>
            <DialogDescription>{time}</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
            {items.length === 0 ? (
              <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
                <UtensilsCrossed className="h-4 w-4" />
                Aucun plat commandé
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item?.id}
                  className="flex items-center justify-between gap-2 text-sm"
                >
                  <span>
                    {item?.qty} × {item?.name}
                  </span>
                  <span className="text-muted-foreground shrink-0">
                    {((item?.price ?? 0) * (item?.qty ?? 0)).toFixed(2)} €
                  </span>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className="flex items-center justify-between text-sm font-semibold border-t pt-2 mt-1">
              <span>Total</span>
              <span>{total.toFixed(2)} €</span>
            </div>
          )}

          {nextStatus && nextLabel && (
            <DialogFooter>
              <Button
                className="w-full"
                disabled={loading}
                onClick={() => {
                  onAdvance(order.id, nextStatus);
                  setOpen(false);
                }}
              >
                {nextLabel}
              </Button>
            </DialogFooter>
          )}

          {status === "served" && (
            <PayAction
              ref={payRef}
              orderId={order.id}
              onPay={onPay}
              onClose={() => setOpen(false)}
              loading={loading}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
