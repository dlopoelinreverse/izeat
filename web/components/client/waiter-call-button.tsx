"use client";

import { useEffect, useState } from "react";
import { BellIcon } from "lucide-react";
import { toast } from "sonner";
import { useMutation } from "@apollo/client/react";
import { Button } from "@/components/ui/button";
import {
  CreateOrderDocument,
  GetTableOrdersDocument,
  type GetTableOrdersQuery,
} from "@/graphql/__generated__/graphql";

function useElapsedLabel(createdAt: string | null) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!createdAt) return;
    const update = () =>
      setElapsed(Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [createdAt]);
  if (!createdAt) return null;
  const min = Math.floor(elapsed / 60);
  return min > 0 ? `${min} min` : `${elapsed} sec`;
}

interface WaiterCallButtonProps {
  restaurantId: string;
  tableId: string | null;
  waiterCall: { id: string; createdAt: string; status: string } | null;
}

export function WaiterCallButton({
  restaurantId,
  tableId,
  waiterCall,
}: WaiterCallButtonProps) {
  const queryVars = { restaurantId, tableId: tableId ?? "" };
  const elapsed = useElapsedLabel(
    waiterCall?.status === "pending" ? waiterCall.createdAt : null,
  );

  const [createWaiterCall, { loading }] = useMutation(CreateOrderDocument, {
    onError: () => toast.error("Erreur lors de l'appel du serveur"),
    update: (cache, { data: mutData }) => {
      if (!tableId || !mutData?.createOrder) return;
      const existing = cache.readQuery<GetTableOrdersQuery>({
        query: GetTableOrdersDocument,
        variables: queryVars,
      });
      if (existing) {
        cache.writeQuery({
          query: GetTableOrdersDocument,
          variables: queryVars,
          data: {
            getTableOrders: [...existing.getTableOrders, mutData.createOrder],
          },
        });
      }
    },
  });

  const handleCallWaiter = async () => {
    if (!tableId) return;
    const { data: mutData } = await createWaiterCall({
      variables: { restaurantId, tableId, type: "waiter_call" },
    });
    if (!mutData) return;
    toast.info("Un serveur arrive !");
  };

  return (
    <Button
      variant={waiterCall ? "secondary" : "outline"}
      size="sm"
      className="gap-1.5 shrink-0"
      onClick={handleCallWaiter}
      disabled={!tableId || loading || !!waiterCall}
    >
      <BellIcon
        className={`h-4 w-4 ${waiterCall?.status === "pending" ? "animate-pulse text-primary" : ""}`}
      />
      {loading
        ? "Appel..."
        : waiterCall
          ? elapsed
            ? `Appelé il y a ${elapsed}`
            : "En attente..."
          : "Appeler"}
    </Button>
  );
}
