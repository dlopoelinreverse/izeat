import { MenuFloatingCart } from "@/components/client/menu-floating-cart"
import { MenuOrderProvider } from "@/contexts/menu-order-context"
import { getMenuForRestaurant } from "@/lib/get-menu"

export default async function MenuLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ restaurantId: string }>
}) {
  const { restaurantId } = await params
  const menu = await getMenuForRestaurant(restaurantId)

  const menuItems =
    menu?.categories?.flatMap((cat) =>
      (cat.items ?? []).map((item) => ({
        id: item.id,
        name: item.dish.name,
        price: item.priceOverride ?? item.dish.price,
      }))
    ) ?? []

  return (
    <div className="min-h-screen bg-[#F7F4EF]">
      <MenuOrderProvider menuItems={menuItems}>
        <div className="w-full bg-[#F7F4EF] min-h-screen flex flex-col">
          <main className="flex-1">{children}</main>
          <MenuFloatingCart />
        </div>
      </MenuOrderProvider>
    </div>
  )
}
