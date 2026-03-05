"use client";

import {
  Drawer,
  DrawerContent,
} from "@/components/ui/drawer";
import { WaiterCallCard } from "./waiter-call-card";
import { FoodOrderCard } from "./food-order-card";

interface MenuStatusDrawerProps {
  open: boolean;
  onClose: () => void;
  restaurantId: string;
  tableId: string;
  waiterCall: { id: string; createdAt: string; status: string } | null;
  foodOrder: { id: string; status: string } | null;
}

export function MenuStatusDrawer({
  open,
  onClose,
  restaurantId,
  tableId,
  waiterCall,
  foodOrder,
}: MenuStatusDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={(v) => !v && onClose()}>
      <DrawerContent
        className="max-h-[96vh]"
        style={{ borderRadius: "24px 24px 0 0", boxShadow: "0 -8px 40px rgba(26,23,20,0.12)" }}
      >
        <div className="mx-auto w-full max-w-md flex flex-col overflow-hidden">
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
              Mon statut
            </h2>
          </div>

          <div className="flex flex-col gap-3 p-5">
            {waiterCall && (
              <WaiterCallCard
                restaurantId={restaurantId}
                tableId={tableId}
                waiterCall={waiterCall}
              />
            )}

            {foodOrder && foodOrder.status !== "payed" && (
              <FoodOrderCard foodOrder={foodOrder} />
            )}

            {!waiterCall && !foodOrder && (
              <p className="text-sm text-[#9A9690] text-center py-8">
                Aucune activité en cours.
              </p>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
