"use client";

import { useEffect, useState } from "react";
import { BellIcon, CheckCircle2Icon, ChefHatIcon, ClockIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

interface WaiterCallInfo {
  id: string;
  createdAt: string;
  status: string;
}

interface FoodOrderInfo {
  id: string;
  status: string;
}

interface MenuStatusDrawerProps {
  open: boolean;
  onClose: () => void;
  waiterCall: WaiterCallInfo | null;
  foodOrder: FoodOrderInfo | null;
  onCancelWaiterCall: (orderId: string) => void;
  cancelLoading: boolean;
}

function useElapsedTime(createdAt: string | undefined) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!createdAt) return;
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

const FOOD_STEPS = [
  { status: "pending", label: "En attente" },
  { status: "preparing", label: "En préparation" },
  { status: "served", label: "Servi" },
];

export function MenuStatusDrawer({
  open,
  onClose,
  waiterCall,
  foodOrder,
  onCancelWaiterCall,
  cancelLoading,
}: MenuStatusDrawerProps) {
  const elapsed = useElapsedTime(
    waiterCall?.status === "pending" ? waiterCall.createdAt : undefined,
  );

  const activeStepIndex = FOOD_STEPS.findIndex(
    (s) => s.status === foodOrder?.status,
  );

  return (
    <Drawer open={open} onOpenChange={(v) => !v && onClose()}>
      <DrawerContent className="max-h-[96vh]">
        <div className="mx-auto w-full max-w-md flex flex-col overflow-hidden">
          <DrawerHeader className="border-b pb-4">
            <DrawerTitle className="text-xl font-bold">Mon statut</DrawerTitle>
          </DrawerHeader>

          <div className="flex flex-col gap-4 p-6">
            {/* Waiter call section */}
            {waiterCall && (
              <div className="rounded-lg border bg-card p-4 space-y-3">
                <div className="flex items-center gap-2 font-semibold text-sm">
                  <BellIcon className="h-4 w-4 text-primary" />
                  Appel serveur
                </div>

                {waiterCall.status === "served" ? (
                  <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                    <CheckCircle2Icon className="h-4 w-4" />
                    Pris en charge
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <ClockIcon className="h-4 w-4" />
                      <span>
                        En attente depuis{" "}
                        <span className="font-semibold tabular-nums text-foreground">
                          {elapsed}
                        </span>
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full h-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                      disabled={cancelLoading}
                      onClick={() => onCancelWaiterCall(waiterCall.id)}
                    >
                      Annuler l&apos;appel
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Food order section */}
            {foodOrder && foodOrder.status !== "payed" && (
              <div className="rounded-lg border bg-card p-4 space-y-4">
                <div className="flex items-center gap-2 font-semibold text-sm">
                  <ChefHatIcon className="h-4 w-4 text-primary" />
                  Ma commande
                </div>

                <div className="flex items-center gap-0">
                  {FOOD_STEPS.map((step, i) => {
                    const isPast = i < activeStepIndex;
                    const isActive = i === activeStepIndex;
                    return (
                      <div key={step.status} className="flex-1 flex flex-col items-center gap-1.5">
                        <div className="flex items-center w-full">
                          {i > 0 && (
                            <div
                              className={`flex-1 h-0.5 ${isPast || isActive ? "bg-primary" : "bg-muted"}`}
                            />
                          )}
                          <div
                            className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                              ${isActive ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2" : ""}
                              ${isPast ? "bg-primary text-primary-foreground" : ""}
                              ${!isActive && !isPast ? "bg-muted text-muted-foreground" : ""}`}
                          >
                            {isPast ? "✓" : i + 1}
                          </div>
                          {i < FOOD_STEPS.length - 1 && (
                            <div
                              className={`flex-1 h-0.5 ${isPast ? "bg-primary" : "bg-muted"}`}
                            />
                          )}
                        </div>
                        <span
                          className={`text-[10px] text-center leading-tight ${isActive ? "text-primary font-semibold" : "text-muted-foreground"}`}
                        >
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {!waiterCall && !foodOrder && (
              <p className="text-sm text-muted-foreground text-center py-6">
                Aucune activité en cours.
              </p>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
