import MenuPage from "@/components/dashboard/menu/menu-page";

export default async function CreateMenuPage({
  params,
}: {
  params: Promise<{ restaurantId: string }>;
}) {
  const { restaurantId } = await params;
  return <MenuPage restaurantId={restaurantId} isCreation />;
}
