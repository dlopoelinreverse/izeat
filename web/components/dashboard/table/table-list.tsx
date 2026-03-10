"use client";

import { useState } from "react";
import DashboardPageLayout from "../dashboard-page-layout";
import {
  GetRestaurantTablesDocument,
  GetRestaurantTablesQuery,
} from "@/graphql/__generated__/graphql";
import { useQuery } from "@apollo/client/react";
import { CreateTable } from "./create-table";
import { Users, LayoutGrid, Plus, QrCode } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DeleteTableButton } from "./delete-table-button";
import { EmptyState } from "../empty-state";
import { TableDetailDrawer } from "./table-detail-drawer";
import { Button } from "@/components/ui/button";

type Table = GetRestaurantTablesQuery["getRestaurantTables"][number];

export const TableList = ({ restaurantId }: { restaurantId: string }) => {
  const [open, setOpen] = useState(false);
  const { data, loading, error } = useQuery(GetRestaurantTablesDocument, {
    variables: { restaurantId },
  });

  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  const tables = data?.getRestaurantTables ?? [];

  return (
    <DashboardPageLayout
      title="Tables"
      headerAction={
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          Ajouter une table
        </Button>
      }
    >
      <CreateTable
        restaurantId={restaurantId}
        existingNumbers={tables.map((t) => t.number)}
        open={open}
        onOpenChange={setOpen}
      />

      {error && (
        <p className="text-sm text-destructive">
          Erreur lors de la récupération des tables
        </p>
      )}

      {loading ? (
        <p className="text-sm text-muted-foreground">Chargement...</p>
      ) : tables.length === 0 ? (
        <EmptyState
          icon={LayoutGrid}
          title="Aucune table configurée"
          description="Commencez par ajouter votre première table pour gérer vos services."
        />
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
          {tables.map((table) => (
            <TableCard
              key={table.id}
              table={table}
              restaurantId={restaurantId}
              onSelect={setSelectedTable}
            />
          ))}
          <button
            onClick={() => setOpen(true)}
            className="rounded-xl border-2 border-dashed border-border hover:border-primary/40 hover:bg-secondary/50 transition-all min-h-[120px] flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <Plus className="size-5" />
            <span className="text-sm font-medium">Nouvelle table</span>
          </button>
        </div>
      )}

      <TableDetailDrawer
        table={selectedTable}
        restaurantId={restaurantId}
        onClose={() => setSelectedTable(null)}
      />
    </DashboardPageLayout>
  );
};

const TableCard = ({
  table,
  restaurantId,
  onSelect,
}: {
  table: Table;
  restaurantId: string;
  onSelect: (table: Table) => void;
}) => {
  return (
    <div
      onClick={() => onSelect(table)}
      className="bg-card rounded-xl border border-border p-5 hover:shadow-sm transition-shadow flex flex-col gap-4 cursor-pointer"
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
          <LayoutGrid className="size-4 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">
            Table {table.number}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            <Users className="inline size-3 mr-1" />
            {table.capacity} personnes
          </p>
        </div>
        <Badge
          variant={table.status === "available" ? "default" : "secondary"}
          className="shrink-0 text-xs"
        >
          {table.status === "available" ? "Libre" : "Occupée"}
        </Badge>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(table);
          }}
          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
        >
          <QrCode className="size-3" />
          Voir le QR code
        </button>
        <DeleteTableButton
          tableId={table.id}
          tableNumber={table.number}
          restaurantId={restaurantId}
        />
      </div>
    </div>
  );
};
