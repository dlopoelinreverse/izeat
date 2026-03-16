import DashboardPageLayout from "@/components/dashboard/dashboard-page-layout";
import { CategoryItems } from "@/components/dashboard/menu/categories/category-items";
import { ItemSheet } from "@/components/dashboard/menu/item/item-sheet";
import { LinkDishSheet } from "@/components/dashboard/menu/item/link-dish-sheet";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ restaurantId: string; menuId: string; categoryId: string }>;
}) {
  const { restaurantId, menuId, categoryId } = await params;

  return (
    <DashboardPageLayout
      hasBackButton
      headerAction={
        <div className="flex gap-2 [&_button]:flex-1">
          <LinkDishSheet
            categoryId={categoryId}
            menuId={menuId}
            restaurantId={restaurantId}
          />
          <ItemSheet
            variant="CREATE"
            categoryId={categoryId}
            menuId={menuId}
            restaurantId={restaurantId}
          />
        </div>
      }
    >
      <CategoryItems
        categoryId={categoryId}
        menuId={menuId}
        restaurantId={restaurantId}
      />
    </DashboardPageLayout>
  );
}
