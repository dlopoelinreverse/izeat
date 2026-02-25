"use client";

import { useMemo } from "react";
import { Search, X } from "lucide-react";

// ── Hook ──────────────────────────────────────────────────────────────────────

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

// ── MenuSearchInput ───────────────────────────────────────────────────────────

interface MenuSearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function MenuSearchInput({ value, onChange }: MenuSearchInputProps) {
  return (
    <div className="px-4 py-3 border-b">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Rechercher un plat ou un ingrédient…"
          className="w-full h-10 pl-9 pr-9 rounded-lg border bg-background text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        {value && (
          <button
            onClick={() => onChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// ── MenuItemCard ──────────────────────────────────────────────────────────────

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
    <div className="flex items-start justify-between gap-4 p-4 rounded-lg border bg-card">
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm leading-snug">{name}</p>
        {categoryName && (
          <p className="text-xs text-primary/70 mt-0.5">{categoryName}</p>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            {description}
          </p>
        )}
      </div>
      <span className="text-sm font-bold text-primary whitespace-nowrap shrink-0">
        {price.toFixed(2)} €
      </span>
    </div>
  );
}
