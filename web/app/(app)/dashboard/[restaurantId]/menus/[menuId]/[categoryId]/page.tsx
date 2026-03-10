import DashboardPageLayout from "@/components/dashboard/dashboard-page-layout";
import { CategoryItems } from "@/components/dashboard/menu/categories/category-items";
import { ItemSheet } from "@/components/dashboard/menu/item/item-sheet";

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
        <ItemSheet
          variant="CREATE"
          categoryId={categoryId}
          menuId={menuId}
          restaurantId={restaurantId}
        />
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
