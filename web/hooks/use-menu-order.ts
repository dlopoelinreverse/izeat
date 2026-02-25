"use client"

import { useQueryState, parseAsJson } from "nuqs"

export type CartItem = {
  id: string
  name: string
  price: number
  qty: number
}

export function useMenuOrder() {
  const [cart, setCart] = useQueryState(
    "cart",
    parseAsJson<CartItem[]>().withDefault([])
  )

  const totalCount = cart.reduce((sum, i) => sum + i.qty, 0)
  const totalPrice = cart.reduce((sum, i) => sum + i.price * i.qty, 0)

  const addItem = (item: Omit<CartItem, "qty">) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) return prev.map((i) => i.id === item.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { ...item, qty: 1 }]
    })
  }

  const removeItem = (id: string) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === id)
      if (existing?.qty === 1) return prev.filter((i) => i.id !== id)
      return prev.map((i) => i.id === id ? { ...i, qty: i.qty - 1 } : i)
    })
  }

  const getItemQty = (id: string) => cart.find((i) => i.id === id)?.qty ?? 0
  const clearOrder = () => setCart([])

  return { cart, totalCount, totalPrice, addItem, removeItem, getItemQty, clearOrder }
}
