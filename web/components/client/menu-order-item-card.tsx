"use client";

import { PlusIcon, MinusIcon } from "lucide-react";
import { useMenuOrder } from "@/contexts/menu-order-context";

interface MenuOrderItemCardProps {
  id: string;
  name: string;
  price: number;
  description?: string | null;
  categoryName?: string;
}

export function MenuOrderItemCard({
  id,
  name,
  price,
  description,
  categoryName,
}: MenuOrderItemCardProps) {
  const { addItem, removeItem, getItemQty } = useMenuOrder();
  const qty = getItemQty(id);

  return (
    <div
      className="flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl bg-white border border-[rgba(26,23,20,0.06)]"
      style={{ boxShadow: "0 1px 4px rgba(26,23,20,0.06)" }}
    >
      <div className="flex-1 min-w-0">
        {categoryName && (
          <p className="text-[11px] text-[#C8963E] font-medium mb-0.5">{categoryName}</p>
        )}
        <p className="font-medium text-sm text-[#1A1714] leading-snug">{name}</p>
        {description && (
          <p className="text-xs text-[#9A9690] mt-0.5 leading-relaxed line-clamp-2">
            {description}
          </p>
        )}
        <p className="text-sm font-semibold text-[#C8963E] mt-1">
          {price.toFixed(2)} €
        </p>
      </div>

      <div className="shrink-0 flex items-center gap-2">
        {qty > 0 && (
          <>
            <button
              onClick={() => removeItem(id)}
              className="w-[30px] h-[30px] flex items-center justify-center rounded-full
                         bg-[#F7F4EF] border border-[rgba(26,23,20,0.1)]
                         hover:border-[rgba(26,23,20,0.2)] transition-colors duration-100 active:scale-90"
              aria-label="Retirer un"
            >
              <MinusIcon className="h-3.5 w-3.5 text-[#1A1714]" />
            </button>
            <span className="text-sm font-semibold min-w-4 text-center tabular-nums text-[#1A1714]">
              {qty}
            </span>
          </>
        )}
        <button
          onClick={() => addItem(id)}
          className="w-[30px] h-[30px] flex items-center justify-center rounded-full
                     bg-[#1A1714] hover:bg-[#2d2a27] transition-colors duration-100 active:scale-90"
          aria-label={`Ajouter ${name}`}
        >
          <PlusIcon className="h-3.5 w-3.5 text-white" />
        </button>
      </div>
    </div>
  );
}

export function MenuOrderItemCardSkeleton() {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl bg-white border border-[rgba(26,23,20,0.06)] animate-pulse">
      <div className="flex-1 space-y-2">
        <div className="h-3 w-2/3 bg-[#F7F4EF] rounded" />
        <div className="h-3 w-1/2 bg-[#F7F4EF] rounded" />
        <div className="h-3.5 w-16 bg-[#F7F4EF] rounded mt-1" />
      </div>
      <div className="w-[30px] h-[30px] rounded-full bg-[#F7F4EF] shrink-0" />
    </div>
  );
}
