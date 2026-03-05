"use client";

import { useEffect, useState } from "react";
import { BellIcon, ClockIcon } from "lucide-react";
import { toast } from "sonner";
import { useMutation } from "@apollo/client/react";
import {
  CancelWaiterCallDocument,
  GetTableOrdersDocument,
  type GetTableOrdersQuery,
} from "@/graphql/__generated__/graphql";

function useElapsedTime(createdAt: string) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const update = () =>
      setElapsed(Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [createdAt]);

  const min = Math.floor(elapsed / 60);
  const sec = elapsed % 60;
  if (min > 0) return `${min} min ${sec < 10 ? "0" : ""}${sec} sec`;
  return `${sec} sec`;
}

interface WaiterCallCardProps {
  restaurantId: string;
  tableId: string;
  waiterCall: { id: string; createdAt: string; status: string };
}

export function WaiterCallCard({
  restaurantId,
  tableId,
  waiterCall,
}: WaiterCallCardProps) {
  const elapsed = useElapsedTime(waiterCall.createdAt);
  const queryVars = { restaurantId, tableId };

  const [cancelCall, { loading }] = useMutation(CancelWaiterCallDocument, {
    onError: () => toast.error("Erreur lors de l'annulation"),
    update: (cache, { data: mutData }) => {
      if (!mutData?.cancelWaiterCall) return;
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
  });

  return (
    <div className="rounded-[14px] bg-[#F7F4EF] border border-[rgba(26,23,20,0.08)] p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-medium text-sm text-[#1A1714]">
          <BellIcon className="h-4 w-4 text-[#C8963E]" />
          Appel serveur
        </div>
        <span className="inline-block w-2 h-2 rounded-full bg-[#C8963E] menu-pulse-dot shrink-0" />
      </div>

      {waiterCall.status === "pending" ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[#9A9690] text-xs">
            <ClockIcon className="h-3.5 w-3.5 shrink-0" />
            <span>
              En attente depuis{" "}
              <span className="font-semibold tabular-nums text-[#1A1714]">
                {elapsed}
              </span>
            </span>
          </div>
          <button
            disabled={loading}
            onClick={() => cancelCall({ variables: { orderId: waiterCall.id } })}
            className="w-full py-2.5 rounded-[10px] border border-[#C0392B] text-[#C0392B]
                       text-sm font-medium bg-transparent hover:bg-[#FDF0EE] transition-colors duration-200
                       disabled:opacity-60"
          >
            {loading ? "Annulation…" : "Annuler l'appel"}
          </button>
        </div>
      ) : (
        <p className="text-xs text-[#2D6A4F] font-medium">Pris en charge ✓</p>
      )}
    </div>
  );
}
