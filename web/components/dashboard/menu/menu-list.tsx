"use client";

import { DeleteMenuButton } from "./delete-menu-button";
import {
  GetMenusDocument,
  GetMenusQuery,
  SetActiveMenuDocument,
} from "@/graphql/__generated__/graphql";
import Link from "next/link";
import DashboardPageLayout from "../dashboard-page-layout";
import { BookOpen, ChevronRight, LayoutGrid, Plus } from "lucide-react";
import { CreateMenu } from "./create-menu";
import { EmptyState } from "../empty-state";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@apollo/client/react";
import { toast } from "sonner";
import { useState } from "react";

interface MenuListProps {
  restaurantId: string;
}

export const MenuList = ({ restaurantId }: MenuListProps) => {
  const [open, setOpen] = useState(false);

  const { data, loading, error } = useQuery(GetMenusDocument, {
    variables: { restaurantId },
  });

  const menus = data?.getMenus ?? [];

  return (
    <DashboardPageLayout
      title="Menus"
      headerAction={
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          Ajouter un menu
        </Button>
      }
    >
      <CreateMenu restaurantId={restaurantId} open={open} onOpenChange={setOpen} />

      {error && (
        <p className="text-sm text-destructive">
          Erreur lors de la récupération des menus
        </p>
      )}

      {loading ? (
        <p className="text-sm text-muted-foreground">Chargement...</p>
      ) : menus.length === 0 ? (
        <EmptyState
          icon={LayoutGrid}
          title="Aucun menu configuré"
          description="Commencez par ajouter votre premier menu pour gérer vos cartes et plats."
        />
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
          {menus.map((menu) => (
            <MenuCard key={menu.id} menu={menu} restaurantId={restaurantId} />
          ))}
          <button
            onClick={() => setOpen(true)}
            className="rounded-xl border-2 border-dashed border-border hover:border-primary/40 hover:bg-secondary/50 transition-all min-h-[120px] flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <Plus className="size-5" />
            <span className="text-sm font-medium">Nouveau menu</span>
          </button>
        </div>
      )}
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
    <div className="bg-card rounded-xl border border-border p-5 hover:shadow-sm transition-shadow flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <div className="shrink-0 w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
          <BookOpen className={`size-4 ${menu.isActive ? "text-foreground" : "text-muted-foreground"}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{menu.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {menu.categories?.length ?? 0} catégories · {menu.items?.length ?? 0} plats
          </p>
        </div>
        {menu.isActive ? (
          <span className="shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full bg-green-50 border border-green-200 text-green-700">
            ● Actif
          </span>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="shrink-0 text-xs text-muted-foreground h-6 px-2"
            disabled={loading}
            onClick={(e) => {
              e.preventDefault();
              setActiveMenu({ variables: { menuId: menu.id, restaurantId } });
            }}
          >
            Activer
          </Button>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <Link
          href={`/app/dashboard/${restaurantId}/menus/${menu.id}`}
          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
        >
          Gérer les catégories <ChevronRight className="size-3" />
        </Link>
        <DeleteMenuButton menuId={menu.id} restaurantId={restaurantId} />
      </div>
    </div>
  );
};
