import { notFound } from "next/navigation";
import { MenuCategorySearch } from "@/components/client/menu-category-search";
import { MenuBackButton } from "@/components/client/menu-back-button";
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
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b">
        <div className="px-4 py-3 flex items-center gap-3">
          <MenuBackButton restaurantId={restaurantId} />
          <span className="font-bold text-lg">{category.name}</span>
        </div>
      </header>

      <MenuCategorySearch category={category} />
    </div>
  );
}
