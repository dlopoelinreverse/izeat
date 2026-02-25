"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { GetActiveMenuQuery } from "@/graphql/__generated__/graphql";
import {
  useMenuItemSearch,
  MenuSearchInput,
  MenuItemCard,
} from "./menu-search-shared";

type Menu = NonNullable<GetActiveMenuQuery["getActiveMenu"]>;

interface MenuHomeSearchProps {
  menu: Menu;
  restaurantId: string;
  tableId?: string;
}

export function MenuHomeSearch({
  menu,
  restaurantId,
  tableId,
}: MenuHomeSearchProps) {
  const [query, setQuery] = useState("");

  const allItems = useMemo(
    () =>
      menu.categories?.flatMap((cat) =>
        (cat.items ?? []).map((item) => ({ ...item, categoryName: cat.name })),
      ) ?? [],
    [menu.categories],
  );

  const filteredItems = useMenuItemSearch(allItems, query);
  const isSearching = query.trim().length > 0;

  return (
    <div>
      <MenuSearchInput value={query} onChange={setQuery} />

      <div className="px-4 py-4">
        {!isSearching ? (
          /* Default: category buttons */
          <div className="space-y-2">
            {menu.categories && menu.categories.length > 0 ? (
              menu.categories.map((category) => {
                const href = tableId
                  ? `/menu/${restaurantId}/${category.id}?table=${tableId}`
                  : `/menu/${restaurantId}/${category.id}`;
                return (
                  <Link
                    key={category.id}
                    href={href}
                    className="flex items-center justify-between w-full h-14 px-4 rounded-lg border bg-background hover:bg-accent transition-colors"
                  >
                    <span className="font-medium">{category.name}</span>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span className="text-xs">
                        {category.items?.length ?? 0} plat
                        {(category.items?.length ?? 0) !== 1 ? "s" : ""}
                      </span>
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </Link>
                );
              })
            ) : (
              <p className="text-center text-muted-foreground text-sm py-8">
                Aucune catégorie disponible.
              </p>
            )}
          </div>
        ) : filteredItems.length === 0 ? (
          /* No results */
          <p className="text-center text-muted-foreground text-sm py-8">
            Aucun plat trouvé pour &laquo;&nbsp;{query}&nbsp;&raquo;.
          </p>
        ) : (
          /* Search results */
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <MenuItemCard
                key={item.id}
                name={item.name}
                price={item.price}
                description={item.description}
                categoryName={item.categoryName}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
