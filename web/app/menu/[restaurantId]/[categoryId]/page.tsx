import { notFound } from "next/navigation";
import { MenuCategorySearch } from "@/components/client/menu-category-search";
import { MenuCategoryHeader } from "@/components/client/menu-category-header";
import { getMenuForRestaurant } from "@/lib/get-menu";

export default async function MenuCategoryPage({
  params,
}: {
  params: Promise<{ restaurantId: string; categoryId: string }>;
  searchParams: Promise<{ table?: string; cart?: string }>;
}) {
  const { restaurantId, categoryId } = await params;

  const menu = await getMenuForRestaurant(restaurantId);
  const category = menu?.categories?.find((c) => c.id === categoryId);

  if (!menu || !category) notFound();

  return (
    <div className="min-h-screen bg-[#F7F4EF]">
      <MenuCategoryHeader
        restaurantId={restaurantId}
        categoryName={category.name}
      />

      <MenuCategorySearch category={category} />
    </div>
  );
}
