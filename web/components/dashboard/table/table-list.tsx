import DashboardPageLayout from "../dashboard-page-layout";
import { RestaurantTable } from "@/graphql/__generated__/graphql";
import { CreateTable } from "./create-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, LayoutGrid } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const TableList = ({
  restaurantId,
  tables,
}: {
  restaurantId: string;
  tables: RestaurantTable[];
}) => {
  return (
    <DashboardPageLayout
      title="Tables"
      headerAction={<CreateTable restaurantId={restaurantId} />}
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
          <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed rounded-xl border-muted bg-muted/30">
            <LayoutGrid className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="text-lg font-medium text-muted-foreground">
              Aucune table configurée
            </p>
            <p className="text-sm text-muted-foreground/60 max-w-xs text-center mt-1">
              Commencez par ajouter votre première table pour gérer vos
              services.
            </p>
          </div>
        )}
      </div>
    </DashboardPageLayout>
  );
};
