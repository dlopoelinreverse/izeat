"use client";

import { useState } from "react";
import { ClockIcon } from "lucide-react";
import { toast } from "sonner";
import { useMutation } from "@apollo/client/react";
import { Button } from "@/components/ui/button";
import {
  CancelWaiterCallDocument,
  GetTableOrdersDocument,
  type GetTableOrdersQuery,
} from "@/graphql/__generated__/graphql";
import { MenuStatusDrawer } from "./menu-status-drawer";

interface OrderStatusButtonProps {
  restaurantId: string;
  tableId: string | null;
  waiterCall: { id: string; createdAt: string; status: string } | null;
  foodOrder: { id: string; status: string } | null;
}

export function OrderStatusButton({
  restaurantId,
  tableId,
  waiterCall,
  foodOrder,
}: OrderStatusButtonProps) {
  const [open, setOpen] = useState(false);
  const queryVars = { restaurantId, tableId: tableId ?? "" };

  const [cancelCall, { loading: cancelLoading }] = useMutation(
    CancelWaiterCallDocument,
    {
      onError: () => toast.error("Erreur lors de l'annulation"),
      update: (cache, { data: mutData }) => {
        if (!tableId || !mutData?.cancelWaiterCall) return;
        const existing = cache.readQuery<GetTableOrdersQuery>({
          query: GetTableOrdersDocument,
          variables: queryVars,
        });
        if (existing) {
          cache.writeQuery({
            query: GetTableOrdersDocument,
            variables: queryVars,
            data: {
              getTableOrders: existing.getTableOrders.map((o) =>
                o.id === mutData.cancelWaiterCall.id
                  ? { ...o, status: "served" }
                  : o,
              ),
            },
          });
        }
      },
    },
  );

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="gap-1.5 shrink-0 relative"
        onClick={() => setOpen(true)}
      >
        <ClockIcon className="h-4 w-4" />
        <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-primary" />
      </Button>

      <MenuStatusDrawer
        open={open}
        onClose={() => setOpen(false)}
        waiterCall={waiterCall}
        foodOrder={foodOrder}
        onCancelWaiterCall={(orderId) => cancelCall({ variables: { orderId } })}
        cancelLoading={cancelLoading}
      />
    </>
  );
}
