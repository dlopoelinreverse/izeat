"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { useMutation } from "@apollo/client/react";
import {
  Drawer,
  DrawerContent,
} from "@/components/ui/drawer";
import { useMenuOrder } from "@/contexts/menu-order-context";
import {
  CreateOrderDocument,
  GetTableOrdersDocument,
  type GetTableOrdersQuery,
} from "@/graphql/__generated__/graphql";

interface TableOrderDrawerProps {
  restaurantId: string;
  tableId: string | null;
  open: boolean;
  onClose: () => void;
}

export function TableOrderDrawer({
  restaurantId,
  tableId,
  open,
  onClose,
}: TableOrderDrawerProps) {
  const { cart, totalPrice, addItem, removeItem, clearOrder } = useMenuOrder();
  const queryVars = { restaurantId, tableId: tableId ?? "" };

  const [createFoodOrder, { loading }] = useMutation(CreateOrderDocument, {
    onError: () => toast.error("Erreur lors de l'envoi de la commande"),
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

  const handlePlaceOrder = async () => {
    if (!tableId) return;
    const { data: mutData } = await createFoodOrder({
      variables: {
        restaurantId,
        tableId,
        type: "food",
        items: cart.map(({ id, name, price, qty }) => ({ id, name, price, qty })),
      },
    });
    if (!mutData) return;
    toast.success("Commande envoyée !");
    clearOrder();
    onClose();
  };

  return (
    <Drawer open={open} onOpenChange={(v) => !v && onClose()}>
      <DrawerContent
        className="max-h-[96vh]"
        style={{ borderRadius: "24px 24px 0 0", boxShadow: "0 -8px 40px rgba(26,23,20,0.12)" }}
      >
        <div className="mx-auto w-full max-w-md flex flex-col h-full overflow-hidden bg-white">
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-4">
            <div className="w-9 h-1 rounded-full bg-[rgba(26,23,20,0.08)]" />
          </div>

          {/* Title */}
          <div className="px-5 pb-4 border-b border-[rgba(26,23,20,0.06)]">
            <h2
              className="text-lg text-center text-[#1A1714]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Ma commande
            </h2>
          </div>

          {/* Items list */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
                <p className="text-sm text-[#9A9690]">Votre commande est vide.</p>
                <p className="text-xs text-[#9A9690]">Ajoutez des plats depuis le menu.</p>
              </div>
            ) : (
              <ul className="divide-y divide-[rgba(26,23,20,0.06)]">
                {cart.map((item) => (
                  <li key={item.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-[#1A1714] leading-snug truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-[#9A9690] mt-0.5">
                        {item.price.toFixed(2)} € / unité
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="w-[26px] h-[26px] flex items-center justify-center rounded-full
                                   bg-[#F7F4EF] border border-[rgba(26,23,20,0.1)]
                                   hover:border-[rgba(26,23,20,0.2)] transition-colors"
                        aria-label="Retirer un"
                      >
                        <MinusIcon className="h-3 w-3 text-[#1A1714]" />
                      </button>
                      <span className="text-sm font-semibold min-w-4 text-center tabular-nums text-[#1A1714]">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => addItem(item.id)}
                        className="w-[26px] h-[26px] flex items-center justify-center rounded-full
                                   bg-[#1A1714] hover:bg-[#2d2a27] transition-colors"
                        aria-label="Ajouter un"
                      >
                        <PlusIcon className="h-3 w-3 text-white" />
                      </button>
                    </div>

                    <span className="text-sm font-semibold text-[#1A1714] whitespace-nowrap shrink-0 min-w-14 text-right tabular-nums">
                      {(item.price * item.qty).toFixed(2)} €
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="px-5 pb-6 pt-3 border-t border-[rgba(26,23,20,0.06)]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-[#9A9690]">Total</span>
                <span className="text-base font-semibold text-[#1A1714] tabular-nums">
                  {totalPrice.toFixed(2)} €
                </span>
              </div>

              {!tableId && (
                <p className="text-xs text-center text-[#9A9690] mb-3">
                  Scannez le QR code de votre table pour passer commande.
                </p>
              )}

              <button
                onClick={handlePlaceOrder}
                disabled={cart.length === 0 || !tableId || loading}
                className="w-full py-4 rounded-[14px] bg-[#1A1714] text-white text-sm font-semibold
                           tracking-[0.02em] hover:bg-[#2d2a27] transition-colors duration-200
                           disabled:opacity-50"
                style={{ boxShadow: "0 4px 20px rgba(26,23,20,0.25)" }}
              >
                {loading ? "Envoi en cours…" : "Passer la commande →"}
              </button>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
