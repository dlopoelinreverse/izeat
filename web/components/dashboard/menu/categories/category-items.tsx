"use client";

import { GetMenuCategoriesDocument } from "@/graphql/__generated__/graphql";
import { useQuery } from "@apollo/client/react";
import { ItemSheet } from "../item/item-sheet";
import { EmptyState } from "../../empty-state";
import { UtensilsCrossed } from "lucide-react";

interface CategoryItemsProps {
  categoryId: string;
  menuId: string;
  restaurantId: string;
}

export const CategoryItems = ({
  categoryId,
  menuId,
  restaurantId,
}: CategoryItemsProps) => {
  const { data, loading, error } = useQuery(GetMenuCategoriesDocument, {
    variables: { menuId },
  });

  if (loading) {
    return <p className="text-sm text-muted-foreground p-4 md:p-6">Chargement...</p>;
  }

  if (error) {
    return <p className="text-sm text-destructive p-4 md:p-6">Erreur : {error.message}</p>;
  }

  const category = data?.getMenuCategories.find((c) => c.id === categoryId);

  if (!category) {
    return <p className="text-sm text-muted-foreground p-4 md:p-6">Catégorie introuvable.</p>;
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div>
        <h2 className="text-base font-semibold text-foreground">{category.name}</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          {category.items?.length ?? 0} plat{(category.items?.length ?? 0) > 1 ? "s" : ""}
        </p>
      </div>

      {!category.items || category.items.length === 0 ? (
        <EmptyState
          icon={UtensilsCrossed}
          title="Aucun plat"
          description="Ajoutez votre premier plat via le bouton + en haut à droite."
        />
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3">
          {category.items.map((item) => (
            <ItemSheet
              key={item.id}
              variant="EDIT"
              itemId={item.id}
              menuId={menuId}
              restaurantId={restaurantId}
            />
          ))}
        </div>
      )}
    </div>
  );
};
