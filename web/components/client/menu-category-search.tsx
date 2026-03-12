"use client";

import { useState, useMemo } from "react";
import type { GetActiveMenuQuery } from "@/graphql/__generated__/graphql";
import {
  useMenuItemSearch,
  MenuSearchInput,
} from "./menu-search-shared";
import { MenuOrderItemCard } from "./menu-order-item-card";

type Category = NonNullable<
  NonNullable<
    NonNullable<GetActiveMenuQuery["getActiveMenu"]>["categories"]
  >[number]
>;

interface MenuCategorySearchProps {
  category: Category;
}

export function MenuCategorySearch({ category }: MenuCategorySearchProps) {
  const [query, setQuery] = useState("");

  const flatItems = useMemo(
    () =>
      (category.items ?? []).map((item) => ({
        id: item.id,
        name: item.dish.name,
        price: item.priceOverride ?? item.dish.price,
        description: item.dish.description,
        ingredients: item.dish.ingredients,
      })),
    [category.items],
  );

  const filteredItems = useMenuItemSearch(flatItems, query);

  return (
    <div>
      <MenuSearchInput value={query} onChange={setQuery} />

      <div className="px-4 py-3 pb-28">
        {filteredItems.length > 0 ? (
          <div className="space-y-2">
            {filteredItems.map((item) => (
              <MenuOrderItemCard
                key={item.id}
                id={item.id}
                name={item.name}
                price={item.price}
                description={item.description}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-[#9A9690] text-sm py-8">
            {query.trim()
              ? `Aucun plat trouvé pour « ${query} ».`
              : "Aucun plat dans cette catégorie."}
          </p>
        )}
      </div>
    </div>
  );
}
