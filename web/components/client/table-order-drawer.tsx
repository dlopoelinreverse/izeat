"use client";

import { MinusIcon, PlusIcon, ShoppingCartIcon } from "lucide-react";
import { toast } from "sonner";
import { useMutation } from "@apollo/client/react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
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
      <DrawerContent className="max-h-[96vh]">
        <div className="mx-auto w-full max-w-md flex flex-col h-full overflow-hidden">
          <DrawerHeader className="border-b pb-4">
            <DrawerTitle className="text-xl font-bold">Ma commande</DrawerTitle>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
                <ShoppingCartIcon className="h-10 w-10 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Votre commande est vide.
                </p>
                <p className="text-xs text-muted-foreground">
                  Ajoutez des plats depuis le menu.
                </p>
              </div>
            ) : (
              <ul className="space-y-3">
                {cart.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-3 rounded-lg border bg-card p-3
                               animate-in fade-in duration-200"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm leading-snug truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.price.toFixed(2)} € / unité
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="size-7 flex items-center justify-center rounded-full border
                                   hover:bg-accent transition-colors"
                        aria-label="Retirer un"
                      >
                        <MinusIcon className="h-3 w-3" />
                      </button>
                      <span className="text-sm font-bold min-w-5 text-center tabular-nums">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => addItem(item.id)}
                        className="size-7 flex items-center justify-center rounded-full
                                   bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                        aria-label="Ajouter un"
                      >
                        <PlusIcon className="h-3 w-3" />
                      </button>
                    </div>
                    <span className="text-sm font-bold text-primary whitespace-nowrap shrink-0 min-w-16 text-right">
                      {(item.price * item.qty).toFixed(2)} €
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <DrawerFooter className="border-t gap-3">
            {cart.length > 0 && (
              <div className="flex items-center justify-between text-sm font-semibold px-1">
                <span>Total</span>
                <span className="tabular-nums">{totalPrice.toFixed(2)} €</span>
              </div>
            )}
            {!tableId && cart.length > 0 && (
              <p className="text-xs text-center text-muted-foreground px-1">
                Scannez le QR code de votre table pour passer commande.
              </p>
            )}
            <Button
              className="w-full h-11 font-semibold"
              onClick={handlePlaceOrder}
              disabled={cart.length === 0 || !tableId || loading}
            >
              {loading ? "Envoi en cours..." : "Passer la commande"}
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
