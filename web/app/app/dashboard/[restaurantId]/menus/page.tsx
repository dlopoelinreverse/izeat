import { MenuList } from "@/components/dashboard/menu/menu-list";

export default async function MenuPage({
  params,
}: {
  params: Promise<{ restaurantId: string }>;
}) {
  const { restaurantId } = await params;

  return <MenuList restaurantId={restaurantId} />;
}
