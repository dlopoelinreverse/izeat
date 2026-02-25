"use client";

import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import type { GetActiveMenuQuery } from "@/graphql/__generated__/graphql";

type Category = NonNullable<
  GetActiveMenuQuery["getActiveMenu"]
>["categories"][number];

interface MenuCategorySearchProps {
  category: NonNullable<Category>;
}

export function MenuCategorySearch({ category }: MenuCategorySearchProps) {
  const [query, setQuery] = useState("");
  const q = query.toLowerCase().trim();

  const filteredItems = useMemo(() => {
    const items = category.items ?? [];
    if (!q) return items;
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.ingredients?.some((link) =>
          link.ingredient.name.toLowerCase().includes(q),
        ),
    );
  }, [category.items, q]);

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
        {filteredItems.length > 0 ? (
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between gap-4 p-4 rounded-lg border bg-card"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm leading-snug">{item.name}</p>
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
        ) : (
          <p className="text-center text-muted-foreground text-sm py-8">
            {q
              ? `Aucun plat trouvé pour « ${query} ».`
              : "Aucun plat dans cette catégorie."}
          </p>
        )}
      </div>
    </div>
  );
}
