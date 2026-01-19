import MenuPageLayout from "@/components/dashboard/menu/menu-page-layout";

export default async function CreateMenuPage({
  params,
}: {
  params: Promise<{ restaurantId: string }>;
}) {
  const { restaurantId } = await params;
  return <MenuPageLayout restaurantId={restaurantId} isCreation />;
}
