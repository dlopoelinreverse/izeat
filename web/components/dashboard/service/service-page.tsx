"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { toast } from "sonner";
import {
  GetRestaurantTablesDocument,
  UpdateOrderStatusDocument,
} from "@/graphql/__generated__/graphql";
import DashboardPageLayout from "../dashboard-page-layout";
import { Button } from "@/components/ui/button";
import { BellRing, ChefHat, Receipt } from "lucide-react";
import { OrderColumn } from "./order-column";
import { WaiterCallSheet } from "./waiter-call-sheet";
import { PayedOrdersSheet } from "./payed-orders-sheet";

import { useOrders } from "@/hooks/use-orders";
import { Order, Status, STATUS_LABELS, STATUSES } from "@/types/service-types";

interface ServicePageProps {
  restaurantId: string;
}

export function ServicePage({ restaurantId }: ServicePageProps) {
  const [activeTab, setActiveTab] = useState<Status>("pending");
  const [waiterSheetOpen, setWaiterSheetOpen] = useState(false);
  const [payedSheetOpen, setPayedSheetOpen] = useState(false);

  const { data: tablesData } = useQuery(GetRestaurantTablesDocument, {
    variables: { restaurantId },
  });
  const tables = tablesData?.getRestaurantTables ?? [];

  const { orders, subError } = useOrders(restaurantId, {
    onOrderCreated: (order: Order) => {
      const table = tables.find((t) => t.id === order.tableId);
      toast.success(
        `Nouvelle commande — Table ${table?.number ?? order.tableId}`,
      );
    },
    onWaiterCallCreated: (order: Order) => {
      const table = tables.find((t) => t.id === order.tableId);
      toast.warning(
        `Appel serveur — Table ${table?.number ?? order.tableId}`,
      );
    },
  });

  const waiterCallOrders = orders.filter(
    (o) => o?.type === "waiter_call" && o?.status !== "served",
  );
  const payedOrders = orders.filter(
    (o) => o?.type !== "waiter_call" && o?.status === "payed",
  );
  const foodOrders = orders.filter(
    (o) => o?.type !== "waiter_call" && o?.status !== "payed",
  );

  const [updateOrderStatus, { loading: updating }] = useMutation(
    UpdateOrderStatusDocument,
    { onError: () => toast.error("Erreur lors de la mise à jour du statut") },
  );

  const handleAdvance = (orderId: string, status: Status) => {
    updateOrderStatus({ variables: { orderId, status } });
  };

  const handleResolveWaiterCall = (orderId: string) => {
    updateOrderStatus({ variables: { orderId, status: "served" } });
  };

  const handlePay = (orderId: string) => {
    updateOrderStatus({ variables: { orderId, status: "payed" } });
  };

  const headerAction = (
    <div className="flex w-full gap-3 md:w-auto md:gap-2">
      <Button
        variant="outline"
        size="sm"
        className={`flex-1 md:flex-none gap-1.5 ${waiterCallOrders.length > 0 ? "animate-pulse" : ""}`}
        onClick={() => setWaiterSheetOpen(true)}
      >
        <BellRing className="h-4 w-4" />
        Appels
        {waiterCallOrders.length > 0 && (
          <span className="inline-flex items-center justify-center h-4 min-w-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold px-1">
            {waiterCallOrders.length}
          </span>
        )}
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="flex-1 md:flex-none gap-1.5"
        onClick={() => setPayedSheetOpen(true)}
      >
        <Receipt className="h-4 w-4" />
        Réglés
        {payedOrders.length > 0 && (
          <span className="inline-flex items-center justify-center h-4 min-w-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold px-1">
            {payedOrders.length}
          </span>
        )}
      </Button>
    </div>
  );

  return (
    <DashboardPageLayout title="Service" headerAction={headerAction}>
      <div className="flex flex-col gap-4 p-4">
        {/* Mobile: tab strip + single column */}
        <div className="lg:hidden">
          <div className="flex overflow-x-auto border-b">
            {STATUSES.map((status) => {
              const count = foodOrders.filter((o) => o?.status === status).length;
              const isActive = activeTab === status;
              return (
                <button
                  key={status}
                  onClick={() => setActiveTab(status)}
                  className={`flex-1 min-w-[100px] flex items-center justify-center gap-1.5 px-3 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap
                    ${isActive ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                >
                  {STATUS_LABELS[status]}
                  <span
                    className={`inline-flex items-center justify-center h-5 min-w-5 rounded-full text-[10px] font-bold px-1
                      ${isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="mt-3">
            <OrderColumn
              status={activeTab}
              orders={foodOrders}
              tables={tables}
              onAdvance={handleAdvance}
              onPay={handlePay}
              loading={updating}
            />
          </div>
        </div>

        {/* Desktop: 3-column kanban */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-4">
          {STATUSES.map((status) => (
            <OrderColumn
              key={status}
              status={status}
              orders={foodOrders}
              tables={tables}
              onAdvance={handleAdvance}
              onPay={handlePay}
              loading={updating}
            />
          ))}
        </div>

        {foodOrders.length === 0 && (
          <div className="hidden lg:flex flex-col items-center justify-center py-16 text-center">
            <ChefHat className="h-12 w-12 text-muted-foreground/20 mb-3" />
            <p className="text-muted-foreground font-medium">
              Aucune commande pour l&apos;instant
            </p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              Les commandes apparaîtront ici en temps réel
            </p>
          </div>
        )}
      </div>

      <WaiterCallSheet
        open={waiterSheetOpen}
        onClose={() => setWaiterSheetOpen(false)}
        orders={waiterCallOrders}
        tables={tables}
        onResolve={handleResolveWaiterCall}
        loading={updating}
      />

      <PayedOrdersSheet
        open={payedSheetOpen}
        onClose={() => setPayedSheetOpen(false)}
        orders={payedOrders}
        tables={tables}
      />
    </DashboardPageLayout>
  );
}
