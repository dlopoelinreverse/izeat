import { MenuClient } from "./menu-client";

export default async function MenuPage({
  params,
  searchParams,
}: {
  params: Promise<{ restaurantId: string }>;
  searchParams: Promise<{ table?: string }>;
}) {
  const { restaurantId } = await params;
  const { table } = await searchParams;

  return <MenuClient restaurantId={restaurantId} tableId={table} />;
}
