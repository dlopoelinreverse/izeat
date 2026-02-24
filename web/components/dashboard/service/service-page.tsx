"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { toast } from "sonner";
import {
  CreateOrderDocument,
  GetRestaurantTablesDocument,
  UpdateOrderStatusDocument,
} from "@/graphql/__generated__/graphql";
import DashboardPageLayout from "../dashboard-page-layout";
import { Button } from "@/components/ui/button";
import { ChefHat, FlaskConical, Wifi } from "lucide-react";
import { SimulatorPanel } from "./simulator-panel";
import { OrderColumn } from "./order-column";
import { useOrders } from "./use-orders";
import { STATUSES, STATUS_LABELS, type Order, type Status } from "./service-types";

interface ServicePageProps {
  restaurantId: string;
}

export function ServicePage({ restaurantId }: ServicePageProps) {
  const [tableId, setTableId] = useState("");
  const [activeTab, setActiveTab] = useState<Status>("pending");
  const [showSimulator, setShowSimulator] = useState(false);

  const { data: tablesData } = useQuery(GetRestaurantTablesDocument, {
    variables: { restaurantId },
  });
  const tables = tablesData?.getRestaurantTables ?? [];

  const { orders, subError } = useOrders(restaurantId, {
    onOrderCreated: (order: Order) => {
      const table = tables.find((t) => t.id === order.tableId);
      toast.success(`Nouvelle commande — Table ${table?.number ?? order.tableId}`);
    },
  });

  const [createOrder, { loading: creating }] = useMutation(CreateOrderDocument, {
    onCompleted: () => {
      const table = tables.find((t) => t.id === tableId);
      toast.success(`Commande envoyée — Table ${table?.number ?? tableId}`);
      setTableId("");
    },
    onError: () => toast.error("Erreur lors de l'envoi de la commande"),
  });

  const [updateOrderStatus, { loading: updating }] = useMutation(
    UpdateOrderStatusDocument,
    { onError: () => toast.error("Erreur lors de la mise à jour du statut") },
  );

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tableId) {
      toast.error("Veuillez sélectionner une table");
      return;
    }
    createOrder({ variables: { restaurantId, tableId } });
  };

  const handleAdvance = (orderId: string, status: Status) => {
    updateOrderStatus({ variables: { orderId, status } });
  };

  const headerAction = (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mr-2">
        <Wifi
          className={`h-3.5 w-3.5 ${subError ? "text-destructive" : "text-green-500"}`}
        />
        <span
          className={subError ? "text-destructive" : "text-green-600 font-medium"}
        >
          {subError ? "Déconnecté" : "En direct"}
        </span>
        {!subError && (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
        )}
      </div>
      <Button
        variant={showSimulator ? "default" : "outline"}
        size="sm"
        onClick={() => setShowSimulator((v) => !v)}
        className="gap-1.5"
      >
        <FlaskConical className="h-4 w-4" />
        Simulateur
      </Button>
    </div>
  );

  return (
    <DashboardPageLayout title="Service" headerAction={headerAction}>
      <div className="flex flex-col gap-4 p-4">
        {showSimulator && (
          <SimulatorPanel
            tables={tables}
            tableId={tableId}
            onTableChange={setTableId}
            onSubmit={handlePlaceOrder}
            loading={creating}
          />
        )}

        {/* Mobile: tab strip + single column */}
        <div className="lg:hidden">
          <div className="flex overflow-x-auto border-b">
            {STATUSES.map((status) => {
              const count = orders.filter((o) => o.status === status).length;
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
              orders={orders}
              tables={tables}
              onAdvance={handleAdvance}
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
              orders={orders}
              tables={tables}
              onAdvance={handleAdvance}
              loading={updating}
            />
          ))}
        </div>

        {orders.length === 0 && (
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
    </DashboardPageLayout>
  );
}
