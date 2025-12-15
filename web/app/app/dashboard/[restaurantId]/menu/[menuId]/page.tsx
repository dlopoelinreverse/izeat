export default async function MenuPage({
  params,
}: {
  params: Promise<{ restaurantId: string; menuId: string }>;
}) {
  const { restaurantId, menuId } = await params;
  return (
    <div>
      Restaurant ID: {restaurantId} Menu ID: {menuId}
    </div>
  );
}
