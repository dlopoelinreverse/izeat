"use client";

import DashboardPageLayout from "../dashboard-page-layout";
import {
  GetRestaurantTablesDocument,
} from "@/graphql/__generated__/graphql";
import { useQuery } from "@apollo/client/react";
import { CreateTable } from "./create-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, LayoutGrid } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DeleteTableButton } from "./delete-table-button";
import { EmptyState } from "../empty-state";

export const TableList = ({ restaurantId }: { restaurantId: string }) => {
  const { data } = useQuery(GetRestaurantTablesDocument, {
    variables: { restaurantId },
  });

  const tables = data?.getRestaurantTables ?? [];
  return (
    <DashboardPageLayout
      title="Tables"
      headerAction={
        <CreateTable
          restaurantId={restaurantId}
          existingNumbers={tables.map((t) => t.number)}
        />
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {tables.length > 0 ? (
          tables.map((table) => (
            <Card
              key={table.id}
              className="group hover:shadow-lg transition-all border-muted h-[160px] flex flex-col relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-2">
                <Badge
                  variant={
                    table.status === "available" ? "default" : "secondary"
                  }
                  className="text-[10px] uppercase tracking-wider"
                >
                  {table.status === "available" ? "Libre" : "Occupée"}
                </Badge>
                <div className="mt-2 flex justify-end">
                  <DeleteTableButton
                    tableId={table.id}
                    restaurantId={restaurantId}
                  />
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <LayoutGrid className="h-5 w-5" />
                  </div>
                  <span className="text-xl font-bold">
                    Table {table.number}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="mt-auto">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Jusqu&apos;à {table.capacity} personnes
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <EmptyState
            icon={LayoutGrid}
            title="Aucune table configurée"
            description="Commencez par ajouter votre première table pour gérer vos services."
          />
        )}
      </div>
    </DashboardPageLayout>
  );
};
