"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  GetRestaurantDishesDocument,
  LinkDishToCategoryDocument,
  GetMenuCategoriesDocument,
  GetMenusDocument,
  type GetMenusQuery,
} from "@/graphql/__generated__/graphql";
import { useQuery, useMutation } from "@apollo/client/react";
import { Link2, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface LinkDishSheetProps {
  categoryId: string;
  menuId: string;
  restaurantId: string;
  existingDishIds?: string[];
}

export const LinkDishSheet = ({
  categoryId,
  menuId,
  restaurantId,
  existingDishIds = [],
}: LinkDishSheetProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { data, loading } = useQuery(GetRestaurantDishesDocument, {
    variables: { restaurantId, search: search || undefined },
    skip: !open,
    fetchPolicy: "network-only",
  });

  const [linkDish, { loading: linking }] = useMutation(
    LinkDishToCategoryDocument,
    {
      onCompleted: () => {
        toast.success("Plat lié avec succès");
      },
      onError: (error) => {
        toast.error(error.message || "Erreur lors de la liaison du plat");
      },
      update: (cache, { data }) => {
        if (!data?.createMenuItem) return;

        const existing = cache.readQuery({
          query: GetMenuCategoriesDocument,
          variables: { menuId },
        });

        if (!existing) return;

        const newCategories = existing.getMenuCategories.map((category) => {
          if (category.id !== categoryId) return category;
          return {
            ...category,
            items: [...(category.items ?? []), data.createMenuItem],
          };
        });

        cache.writeQuery({
          query: GetMenuCategoriesDocument,
          variables: { menuId },
          data: { getMenuCategories: newCategories },
        });

        // Update GetMenusDocument to keep menu card item count in sync
        const existingMenus = cache.readQuery<GetMenusQuery>({
          query: GetMenusDocument,
          variables: { restaurantId },
        });

        if (existingMenus) {
          cache.writeQuery({
            query: GetMenusDocument,
            variables: { restaurantId },
            data: {
              getMenus: existingMenus.getMenus.map((m) =>
                m.id === menuId
                  ? {
                      ...m,
                      items: [
                        ...(m.items ?? []),
                        {
                          __typename: "MenuItem" as const,
                          id: data.createMenuItem.id,
                        },
                      ],
                    }
                  : m,
              ),
            },
          });
        }
      },
    },
  );

  const dishes = data?.getRestaurantDishes ?? [];

  // Get dish IDs already in this category from the cache
  const { data: categoriesData } = useQuery(GetMenuCategoriesDocument, {
    variables: { menuId },
    skip: !open,
  });

  const linkedDishIds = useMemo(() => {
    if (!categoriesData) return new Set(existingDishIds);
    const category = categoriesData.getMenuCategories.find(
      (c) => c.id === categoryId,
    );
    const ids = category?.items?.map((item) => item.dishId) ?? [];
    return new Set([...existingDishIds, ...ids]);
  }, [categoriesData, categoryId, existingDishIds]);

  const handleLink = (dishId: string) => {
    linkDish({
      variables: {
        menuItemInput: {
          dishId,
          menuId,
          categoryId,
        },
      },
    });
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-muted-foreground hover:text-foreground shrink-0"
        onClick={() => setOpen(true)}
      >
        <Link2 className="size-3.5" />
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full sm:max-w-[520px] p-0 gap-0 flex flex-col">
          <SheetHeader className="px-6 pt-6 pb-4 border-b shrink-0">
            <SheetTitle>Lier un plat existant</SheetTitle>
          </SheetHeader>

          <div className="px-6 py-4 border-b shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un plat..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : dishes.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-8">
                {search
                  ? `Aucun plat trouvé pour « ${search} ».`
                  : "Aucun plat disponible. Créez d'abord un plat."}
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {dishes.map((dish) => {
                  const isLinked = linkedDishIds.has(dish.id);
                  return (
                    <div
                      key={dish.id}
                      className="flex items-start justify-between gap-3 p-3 rounded-lg border border-border bg-card"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-foreground truncate">
                            {dish.name}
                          </p>
                          {isLinked && (
                            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground shrink-0">
                              Déjà lié
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {dish.price.toFixed(2)} €
                        </p>
                        {dish.description && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                            {dish.description}
                          </p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isLinked || linking}
                        onClick={() => handleLink(dish.id)}
                        className="shrink-0"
                      >
                        Lier
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
