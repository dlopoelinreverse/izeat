"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronRight, Search, X } from "lucide-react";
import type { GetActiveMenuQuery } from "@/graphql/__generated__/graphql";

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
  const q = query.toLowerCase().trim();

  const allItems = useMemo(
    () =>
      menu.categories?.flatMap((cat) =>
        (cat.items ?? []).map((item) => ({ ...item, categoryName: cat.name })),
      ) ?? [],
    [menu.categories],
  );

  const filteredItems = useMemo(() => {
    if (!q) return [];
    return allItems.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.ingredients?.some((link) =>
          link.ingredient.name.toLowerCase().includes(q),
        ),
    );
  }, [allItems, q]);

  const isSearching = q.length > 0;

  return (
    <div>
      {/* Search input */}
      <div className="px-4 py-3 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un plat ou un ingrédient…"
            className="w-full h-10 pl-9 pr-9 rounded-lg border bg-background text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

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
          /* Search results: flat list with category label */
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between gap-4 p-4 rounded-lg border bg-card"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm leading-snug">{item.name}</p>
                  <p className="text-xs text-primary/70 mt-0.5">
                    {item.categoryName}
                  </p>
                  {item.description && (
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
                <span className="text-sm font-bold text-primary whitespace-nowrap shrink-0">
                  {item.price.toFixed(2)} €
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
