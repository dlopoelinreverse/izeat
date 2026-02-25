"use client"

import { useState } from "react"
import { BellIcon, ShoppingCartIcon, MinusIcon, PlusIcon } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer"
import { useMenuOrder } from "@/hooks/use-menu-order"

export function MenuFooter() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { cart, totalCount, totalPrice, addItem, removeItem, clearOrder } = useMenuOrder()

  const handleCallWaiter = () => toast.info("Un serveur arrive !")

  const handlePlaceOrder = () => {
    toast.success("Commande envoyée !")
    clearOrder()
    setDrawerOpen(false)
  }

  return (
    <>
      {/* ─── Barre footer sticky ─── */}
      <footer className="sticky bottom-0 z-10 border-t bg-background/95 backdrop-blur">
        <div className="flex items-center justify-between gap-3 px-4 py-3">

          {/* Bouton appeler serveur — compact, toujours visible */}
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 shrink-0"
            onClick={handleCallWaiter}
          >
            <BellIcon className="h-4 w-4" />
            Appeler
          </Button>

          {/* Pill commande — animée à l'apparition ET à chaque ajout */}
          {totalCount > 0 && (
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex items-center gap-2 bg-primary text-primary-foreground
                         rounded-full px-4 py-1.5 text-sm font-semibold
                         hover:bg-primary/90 transition-colors
                         animate-in fade-in slide-in-from-right-4 duration-300"
            >
              <ShoppingCartIcon className="h-4 w-4" />
              {/* key force re-mount → re-déclenche animate-in à chaque ajout */}
              <span
                key={totalCount}
                className="bg-primary-foreground/20 rounded-full px-1.5 py-0.5
                           text-xs font-bold leading-none
                           animate-in zoom-in-75 duration-150"
              >
                {totalCount}
              </span>
              <span
                key={totalPrice.toFixed(2)}
                className="tabular-nums animate-in fade-in duration-150"
              >
                {totalPrice.toFixed(2)} €
              </span>
            </button>
          )}
        </div>
      </footer>

      {/* ─── Drawer détail commande ─── */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="max-h-[96vh]">
          <div className="mx-auto w-full max-w-md flex flex-col h-full overflow-hidden">

            <DrawerHeader className="border-b pb-4">
              <DrawerTitle className="text-xl font-bold">Ma commande</DrawerTitle>
            </DrawerHeader>

            {/* Zone scrollable */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
                  <ShoppingCartIcon className="h-10 w-10 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Votre commande est vide.</p>
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
                        <p className="font-medium text-sm leading-snug truncate">{item.name}</p>
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
                        <span className="text-sm font-bold min-w-[1.25rem] text-center tabular-nums">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => addItem({ id: item.id, name: item.name, price: item.price })}
                          className="size-7 flex items-center justify-center rounded-full
                                     bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                          aria-label="Ajouter un"
                        >
                          <PlusIcon className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-primary whitespace-nowrap shrink-0 min-w-[4rem] text-right">
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
              <Button
                className="w-full h-11 font-semibold"
                onClick={handlePlaceOrder}
                disabled={cart.length === 0}
              >
                Passer la commande
              </Button>
            </DrawerFooter>

          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}
