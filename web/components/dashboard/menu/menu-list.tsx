import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeleteMenuButton } from "./delete-menu-button";
import { GetMenusQuery } from "@/graphql/__generated__/graphql";
import Link from "next/link";
import DashboardPageLayout from "../dashboard-page-layout";
import { Badge } from "@/components/ui/badge";
import { LayoutGrid, BookOpen, List, UtensilsCrossed } from "lucide-react";
import { CreateMenu } from "./create-menu";

interface MenuListProps {
  restaurantId: string;
  menus: GetMenusQuery["getMenus"];
}

export const MenuList = ({ restaurantId, menus }: MenuListProps) => {
  return (
    <DashboardPageLayout
      title="Menus"
      headerAction={<CreateMenu restaurantId={restaurantId} />}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {menus.length > 0 ? (
          menus.map((menu) => (
            <Card
              key={menu.id}
              className="group hover:shadow-lg transition-all border-muted h-[160px] flex flex-col relative overflow-hidden cursor-pointer"
            >
              <div className="absolute top-0 right-0 p-2 z-10">
                <DeleteMenuButton menuId={menu.id} />
              </div>

              <Link
                href={`/app/dashboard/${restaurantId}/menus/${menu.id}`}
                className="flex-1 flex flex-col"
              >
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <span className="text-xl font-bold truncate pr-8">
                      {menu.name}
                    </span>
                  </CardTitle>
                </CardHeader>

                <CardContent className="mt-auto flex gap-3">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <List className="h-4 w-4" />
                    <span className="text-xs font-medium">
                      {menu.categories?.length || 0} catégories
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <UtensilsCrossed className="h-4 w-4" />
                    <span className="text-xs font-medium">
                      {menu.items?.length || 0} plats
                    </span>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed rounded-xl border-muted bg-muted/30">
            <LayoutGrid className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="text-lg font-medium text-muted-foreground">
              Aucun menu configuré
            </p>
            <p className="text-sm text-muted-foreground/60 max-w-xs text-center mt-1">
              Commencez par ajouter votre premier menu pour gérer vos cartes et
              plats.
            </p>
          </div>
        )}
      </div>
    </DashboardPageLayout>
  );
};
