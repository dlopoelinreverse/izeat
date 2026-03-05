"use client";

import { useMemo } from "react";
import { Search, X } from "lucide-react";

export type FilterableItem = {
  id: string;
  name: string;
  price: number;
  description?: string | null;
  categoryName?: string;
  ingredients?: { ingredient: { name: string } }[] | null;
};

export function useMenuItemSearch<T extends FilterableItem>(
  items: readonly T[],
  query: string,
): readonly T[] {
  const q = query.toLowerCase().trim();
  return useMemo(() => {
    if (!q) return items;
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.ingredients?.some((link) =>
          link.ingredient.name.toLowerCase().includes(q),
        ),
    );
  }, [items, q]);
}

interface MenuSearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function MenuSearchInput({ value, onChange }: MenuSearchInputProps) {
  return (
    <div className="px-4 py-3">
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9A9690]" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Rechercher un plat ou un ingrédient"
          className="w-full h-11 pl-10 pr-9 rounded-[14px] border border-[rgba(26,23,20,0.1)]
                     bg-white text-sm text-[#1A1714] placeholder:text-[#9A9690]
                     outline-none focus:border-[rgba(26,23,20,0.25)] transition-colors"
          style={{ boxShadow: "0 1px 4px rgba(26,23,20,0.04)" }}
        />
        {value && (
          <button
            onClick={() => onChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A9690] hover:text-[#1A1714] transition-colors"
            aria-label="Effacer la recherche"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

interface MenuItemCardProps {
  name: string;
  price: number;
  description?: string | null;
  categoryName?: string;
}

export function MenuItemCard({
  name,
  price,
  description,
  categoryName,
}: MenuItemCardProps) {
  return (
    <div
      className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-white border border-[rgba(26,23,20,0.06)]"
      style={{ boxShadow: "0 1px 4px rgba(26,23,20,0.06)" }}
    >
      <div className="flex-1 min-w-0">
        {categoryName && (
          <p className="text-[11px] text-[#C8963E] font-medium mb-0.5">{categoryName}</p>
        )}
        <p className="font-medium text-sm text-[#1A1714] leading-snug">{name}</p>
        {description && (
          <p className="text-xs text-[#9A9690] mt-1 leading-relaxed line-clamp-2">{description}</p>
        )}
      </div>
      <span className="text-sm font-semibold text-[#C8963E] whitespace-nowrap shrink-0">
        {price.toFixed(2)} €
      </span>
    </div>
  );
}
