"use client"

import { createContext, useContext, useMemo } from "react"
import { useQueryState, createParser } from "nuqs"

type CartEntry = { id: string; qty: number }
export type CartItem = { id: string; name: string; price: number; qty: number }

interface MenuOrderContextValue {
  cart: CartItem[]
  totalCount: number
  totalPrice: number
  addItem: (id: string) => void
  removeItem: (id: string) => void
  getItemQty: (id: string) => number
  clearOrder: () => void
}

const cartParser = createParser<CartEntry[]>({
  parse(str) {
    try {
      const v = JSON.parse(str)
      if (!Array.isArray(v)) return null
      return v.filter(
        (e): e is CartEntry =>
          typeof e?.id === "string" && typeof e?.qty === "number" && e.qty > 0
      )
    } catch {
      return null
    }
  },
  serialize: JSON.stringify,
}).withDefault([])

const MenuOrderContext = createContext<MenuOrderContextValue | null>(null)

export function MenuOrderProvider({
  children,
  menuItems,
}: {
  children: React.ReactNode
  menuItems: { id: string; name: string; price: number }[]
}) {
  const registry = useMemo(
    () => new Map(menuItems.map((i) => [i.id, { name: i.name, price: i.price }])),
    [menuItems]
  )

  const [entries, setEntries] = useQueryState("cart", cartParser)

  const cart = useMemo(
    () =>
      entries
        .filter((e) => registry.has(e.id))
        .map((e) => ({ id: e.id, qty: e.qty, ...registry.get(e.id)! })),
    [entries, registry]
  )

  const totalCount = cart.reduce((s, i) => s + i.qty, 0)
  const totalPrice = cart.reduce((s, i) => s + i.price * i.qty, 0)

  const addItem = (id: string) => {
    setEntries((prev) => {
      const existing = prev.find((e) => e.id === id)
      if (existing) return prev.map((e) => e.id === id ? { ...e, qty: e.qty + 1 } : e)
      return [...prev, { id, qty: 1 }]
    })
  }

  const removeItem = (id: string) => {
    setEntries((prev) => {
      const existing = prev.find((e) => e.id === id)
      if (existing?.qty === 1) return prev.filter((e) => e.id !== id)
      return prev.map((e) => e.id === id ? { ...e, qty: e.qty - 1 } : e)
    })
  }

  const getItemQty = (id: string) => entries.find((e) => e.id === id)?.qty ?? 0
  const clearOrder = () => setEntries([])

  return (
    <MenuOrderContext.Provider
      value={{ cart, totalCount, totalPrice, addItem, removeItem, getItemQty, clearOrder }}
    >
      {children}
    </MenuOrderContext.Provider>
  )
}

export function useMenuOrder() {
  const ctx = useContext(MenuOrderContext)
  if (!ctx) throw new Error("useMenuOrder must be used inside MenuOrderProvider")
  return ctx
}
