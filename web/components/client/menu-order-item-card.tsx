"use client"

import { PlusIcon, MinusIcon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useMenuOrder } from "@/hooks/use-menu-order"

interface MenuOrderItemCardProps {
  id: string
  name: string
  price: number
  description?: string | null
  categoryName?: string
}

export function MenuOrderItemCard({
  id,
  name,
  price,
  description,
  categoryName,
}: MenuOrderItemCardProps) {
  const { addItem, removeItem, getItemQty } = useMenuOrder()
  const qty = getItemQty(id)

  return (
    <div className="flex items-start gap-4 p-4 rounded-lg border bg-card">
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
        <p className="text-sm font-bold text-primary mt-1">{price.toFixed(2)} €</p>
      </div>

      {qty === 0 ? (
        <button
          onClick={() => addItem({ id, name, price })}
          className="shrink-0 size-8 flex items-center justify-center rounded-full
                     bg-primary text-primary-foreground
                     transition-transform duration-100 active:scale-90 hover:bg-primary/90"
          aria-label={`Ajouter ${name}`}
        >
          <PlusIcon className="h-4 w-4" />
        </button>
      ) : (
        <div className="shrink-0 flex items-center gap-1.5 animate-in fade-in duration-200">
          <button
            onClick={() => removeItem(id)}
            className="size-8 flex items-center justify-center rounded-full border
                       transition-colors hover:bg-accent active:scale-90 duration-100"
            aria-label="Retirer un"
          >
            <MinusIcon className="h-4 w-4" />
          </button>
          <span className="text-sm font-bold min-w-[1.25rem] text-center tabular-nums">
            {qty}
          </span>
          <button
            onClick={() => addItem({ id, name, price })}
            className="size-8 flex items-center justify-center rounded-full
                       bg-primary text-primary-foreground
                       transition-transform duration-100 active:scale-90 hover:bg-primary/90"
            aria-label="Ajouter un"
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}

export function MenuOrderItemCardSkeleton() {
  return (
    <div className="flex items-start gap-4 p-4 rounded-lg border bg-card">
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-4 w-16 mt-1" />
      </div>
      <Skeleton className="size-8 rounded-full shrink-0" />
    </div>
  )
}
