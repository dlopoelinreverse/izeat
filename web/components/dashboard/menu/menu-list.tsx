"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeleteMenuButton } from "./delete-menu-button";
import {
  GetMenusDocument,
  GetMenusQuery,
  SetActiveMenuDocument,
} from "@/graphql/__generated__/graphql";
import Link from "next/link";
import DashboardPageLayout from "../dashboard-page-layout";
import { LayoutGrid, BookOpen, List, UtensilsCrossed, Zap } from "lucide-react";
import { CreateMenu } from "./create-menu";
import { EmptyState } from "../empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@apollo/client/react";
import { toast } from "sonner";

interface MenuListProps {
  restaurantId: string;
}

export const MenuList = ({ restaurantId }: MenuListProps) => {
  const { data, loading, error } = useQuery(GetMenusDocument, {
    variables: { restaurantId },
  });

  const menus = data?.getMenus ?? [];

  return (
    <DashboardPageLayout
      title="Menus"
      headerAction={<CreateMenu restaurantId={restaurantId} />}
    >
      {error && (
        <p className="text-sm text-destructive">
          Erreur lors de la récupération des menus
        </p>
      )}
      <div className="flex flex-wrap gap-4 justify-start">
        {loading ? (
          <p className="text-sm text-muted-foreground">Chargement...</p>
        ) : menus.length > 0 ? (
          menus.map((menu) => (
            <MenuCard key={menu.id} menu={menu} restaurantId={restaurantId} />
          ))
        ) : (
          <EmptyState
            icon={LayoutGrid}
            title="Aucun menu configuré"
            description="Commencez par ajouter votre premier menu pour gérer vos cartes et plats."
          />
        )}
      </div>
    </DashboardPageLayout>
  );
};

const MenuCard = ({
  menu,
  restaurantId,
}: {
  menu: GetMenusQuery["getMenus"][number];
  restaurantId: string;
}) => {
  const [setActiveMenu, { loading }] = useMutation(SetActiveMenuDocument, {
    onCompleted: () => toast.success(`Menu "${menu.name}" activé`),
    onError: (err) => toast.error(err.message),
    update: (cache, { data }) => {
      const existing = cache.readQuery<GetMenusQuery>({
        query: GetMenusDocument,
        variables: { restaurantId },
      });
      if (existing && data?.setActiveMenu) {
        cache.writeQuery({
          query: GetMenusDocument,
          variables: { restaurantId },
          data: {
            getMenus: existing.getMenus.map((m) => ({
              ...m,
              isActive: m.id === data.setActiveMenu.id,
            })),
          },
        });
      }
    },
  });

  return (
    <Card
      key={menu.id}
      className="group hover:shadow-lg transition-all border-muted h-[160px] flex flex-col relative overflow-hidden cursor-pointer w-full xl:w-[22%] lg:w-[30%] md:w-[48%]"
    >
      <div className="absolute top-0 right-0 p-2 z-10 flex flex-col items-end gap-1">
        {menu.isActive && (
          <Badge className="text-[10px] uppercase tracking-wider bg-green-500 hover:bg-green-500">
            Actif
          </Badge>
        )}
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
            <span className="text-xl font-bold truncate pr-8">{menu.name}</span>
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

      {!menu.isActive && (
        <div className="absolute bottom-2 right-2 z-10">
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs gap-1"
            disabled={loading}
            onClick={(e) => {
              e.preventDefault();
              setActiveMenu({ variables: { menuId: menu.id, restaurantId } });
            }}
          >
            <Zap className="h-3 w-3" />
            Activer
          </Button>
        </div>
      )}
    </Card>
  );
};
