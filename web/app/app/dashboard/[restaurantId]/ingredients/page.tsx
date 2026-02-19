import { IngredientsPageContent } from "@/components/dashboard/ingredient/ingredients-page-content";

export default async function IngredientsPage({
  params,
}: {
  params: Promise<{ restaurantId: string }>;
}) {
  const { restaurantId } = await params;

  return <IngredientsPageContent restaurantId={restaurantId} />;
}
