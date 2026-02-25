import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { MenuCategorySearch } from "@/components/client/menu-category-search";
import { getMenuForRestaurant } from "@/lib/get-menu";

export default async function MenuCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ restaurantId: string; categoryId: string }>;
  searchParams: Promise<{ table?: string }>;
}) {
  const { restaurantId, categoryId } = await params;
  const { table } = await searchParams;

  const menu = await getMenuForRestaurant(restaurantId);
  const category = menu?.categories?.find((c) => c.id === categoryId);

  if (!menu || !category) notFound();

  const backHref = table
    ? `/menu/${restaurantId}?table=${table}`
    : `/menu/${restaurantId}`;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b">
        <div className="px-4 py-3 flex items-center gap-3">
          <Link
            href={backHref}
            className="flex items-center justify-center size-8 rounded-md hover:bg-accent transition-colors"
            aria-label="Retour"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <span className="font-bold text-lg">{category.name}</span>
        </div>
      </header>

      <MenuCategorySearch category={category} />
    </div>
  );
}
