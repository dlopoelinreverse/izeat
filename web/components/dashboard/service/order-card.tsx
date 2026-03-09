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
        className="bg-card rounded-xl border border-border shadow-sm p-3 cursor-pointer hover:shadow-md transition-shadow select-none flex flex-col gap-2"
      >
        {/* Row 1: table + time */}
        <div className="flex items-center">
          <span className="text-sm font-bold text-foreground">
            Table {table?.number ?? order?.tableId}
          </span>
          <span className="text-xs text-muted-foreground ml-auto">{time}</span>
        </div>

        {/* Row 2: item badges */}
        {items.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {items.slice(0, 2).map((item) => (
              <span
                key={item?.id}
                className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-md"
              >
                {item?.qty && item.qty > 1 ? `${item.qty}× ` : ""}{item?.name}
              </span>
            ))}
            {items.length > 2 && (
              <span className="text-xs text-muted-foreground px-2 py-0.5">
                +{items.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Row 3: action button */}
        {status === "served" ? (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            disabled={loading}
            onClick={(e) => {
              e.stopPropagation();
              onPay(order.id);
            }}
          >
            Encaisser
          </Button>
        ) : nextStatus && nextLabel ? (
          <Button
            variant="default"
            size="sm"
            className="w-full"
            disabled={loading}
            onClick={(e) => {
              e.stopPropagation();
              onAdvance(order.id, nextStatus);
            }}
          >
            {status === "pending" ? "Accepter" : "Prêt à servir"}
          </Button>
        ) : null}
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
