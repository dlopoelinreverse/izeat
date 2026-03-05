"use client";

import { useEffect, useState } from "react";
import { BellIcon } from "lucide-react";
import { toast } from "sonner";
import { useMutation } from "@apollo/client/react";
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
  const sec = elapsed % 60;
  if (min > 0) return `${min} min ${sec < 10 ? "0" : ""}${sec} sec`;
  return `${sec} sec`;
}

interface WaiterCallRowProps {
  restaurantId: string;
  tableId: string | null;
  waiterCall: { id: string; createdAt: string; status: string } | null;
  onOpenStatus: () => void;
}

export function WaiterCallRow({
  restaurantId,
  tableId,
  waiterCall,
  onOpenStatus,
}: WaiterCallRowProps) {
  const queryVars = { restaurantId, tableId: tableId ?? "" };
  const isPending = waiterCall?.status === "pending";
  const elapsed = useElapsedLabel(isPending ? waiterCall!.createdAt : null);

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

  const handleClick = async () => {
    if (isPending) {
      onOpenStatus();
      return;
    }
    if (!tableId || loading) return;
    await createWaiterCall({
      variables: { restaurantId, tableId, type: "waiter_call" },
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading || (!tableId && !isPending)}
      className={`
        w-full flex items-center gap-3 px-4 py-3.5 rounded-[20px] border
        transition-all duration-200 active:scale-[0.98]
        ${
          isPending
            ? "bg-[#C8963E] border-[#C8963E] text-white"
            : "bg-[#F7F4EF] border-[rgba(26,23,20,0.1)] text-[#1A1714]"
        }
        disabled:opacity-50
      `}
      aria-label={isPending ? "Serveur appelé — appuyer pour annuler" : "Appeler un serveur"}
    >
      <BellIcon
        className={`h-5 w-5 shrink-0 ${isPending ? "text-white" : "text-[#C8963E]"}`}
      />
      <div className="flex-1 text-left">
        <p className={`text-sm font-semibold ${isPending ? "text-white" : "text-[#1A1714]"}`}>
          {loading ? "Appel en cours…" : isPending ? "Serveur appelé" : "Appeler un serveur"}
        </p>
        <p className={`text-xs mt-0.5 ${isPending ? "text-white/80" : "text-[#9A9690]"}`}>
          {isPending
            ? elapsed
              ? `Il y a ${elapsed} · Appuyer pour annuler`
              : "En attente… · Appuyer pour annuler"
            : "Appuyez pour demander de l'aide"}
        </p>
      </div>
      {isPending ? (
        <span className="inline-block w-2 h-2 rounded-full bg-white menu-pulse-dot shrink-0" />
      ) : (
        <span className="text-[#9A9690] text-lg leading-none shrink-0">›</span>
      )}
    </button>
  );
}
