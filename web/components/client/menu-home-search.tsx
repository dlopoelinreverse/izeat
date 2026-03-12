"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronRight } from "lucide-react";
import type { GetActiveMenuQuery } from "@/graphql/__generated__/graphql";
import {
  useMenuItemSearch,
  MenuSearchInput,
} from "./menu-search-shared";
import { MenuOrderItemCard } from "./menu-order-item-card";

type Menu = NonNullable<GetActiveMenuQuery["getActiveMenu"]>;

interface MenuHomeSearchProps {
  menu: Menu;
  restaurantId: string;
  tableId?: string;
}

const CATEGORY_EMOJIS = ["🥗", "🍽️", "🍖", "🍝", "🥩", "🍣", "🥘", "🍜", "🥙", "🍱"];

export function MenuHomeSearch({
  menu,
  restaurantId,
  tableId,
}: MenuHomeSearchProps) {
  const [query, setQuery] = useState("");
  const searchParams = useSearchParams();
  const cart = searchParams.get("cart");
  const tableNum = searchParams.get("tableNum");

  const allItems = useMemo(
    () =>
      menu.categories?.flatMap((cat) =>
        (cat.items ?? []).map((item) => ({
          id: item.id,
          name: item.dish.name,
          price: item.priceOverride ?? item.dish.price,
          description: item.dish.description,
          ingredients: item.dish.ingredients,
          categoryName: cat.name,
        })),
      ) ?? [],
    [menu.categories],
  );

  const filteredItems = useMenuItemSearch(allItems, query);
  const isSearching = query.trim().length > 0;

  return (
    <div>
      <MenuSearchInput value={query} onChange={setQuery} />

      <div className="px-4 py-3">
        {!isSearching ? (
          <div className="space-y-2">
            {menu.categories && menu.categories.length > 0 ? (
              <>
                <p className="text-xs font-semibold text-[#9A9690] uppercase tracking-wider px-1 mb-3">
                  Notre carte
                </p>
                {menu.categories.map((category, index) => {
                  const catParams = new URLSearchParams();
                  if (tableId) catParams.set("table", tableId);
                  if (tableNum) catParams.set("tableNum", tableNum);
                  if (cart) catParams.set("cart", cart);
                  const catQuery = catParams.toString();
                  const href = `/menu/${restaurantId}/${category.id}${catQuery ? `?${catQuery}` : ""}`;
                  const emoji = CATEGORY_EMOJIS[index % CATEGORY_EMOJIS.length];
                  const itemCount = category.items?.length ?? 0;

                  return (
                    <Link
                      key={category.id}
                      href={href}
                      className="flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl bg-white
                                 border border-[rgba(26,23,20,0.06)] hover:border-[rgba(26,23,20,0.12)]
                                 transition-all duration-200 active:scale-[0.98]"
                      style={{ boxShadow: "0 1px 4px rgba(26,23,20,0.06)" }}
                    >
                      <div
                        className="w-10 h-10 rounded-[10px] bg-[#F7F4EF] flex items-center justify-center text-xl shrink-0"
                      >
                        {emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-[#1A1714]">{category.name}</p>
                        <p className="text-xs text-[#9A9690] mt-0.5">
                          {itemCount} {itemCount === 1 ? "plat disponible" : "plats disponibles"}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-[#9A9690] shrink-0" />
                    </Link>
                  );
                })}
              </>
            ) : (
              <p className="text-center text-[#9A9690] text-sm py-8">
                Aucune catégorie disponible.
              </p>
            )}
          </div>
        ) : filteredItems.length === 0 ? (
          <p className="text-center text-[#9A9690] text-sm py-8">
            Aucun plat trouvé pour &laquo;&nbsp;{query}&nbsp;&raquo;.
          </p>
        ) : (
          <div className="space-y-2">
            {filteredItems.map((item) => (
              <MenuOrderItemCard
                key={item.id}
                id={item.id}
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
