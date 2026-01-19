import { MenuCategories } from "./categories/menu-categories";
import { ItemList } from "./item/item-list";
import { MenuName } from "./menu-name";
import { Menu, GetMenuQuery } from "@/graphql/__generated__/graphql";

interface MenuPageProps {
  restaurantId: string;
  isCreation?: boolean;
  menu?: Menu | GetMenuQuery["getMenu"];
}

export default function MenuPageLayout({
  restaurantId,
  isCreation,
  menu,
}: MenuPageProps) {
  return (
    <main className="w-full h-full flex flex-col gap-4">
      <div className="w-full flex justify-between items-center gap-4">
        <MenuName
          restaurantId={restaurantId}
          isCreation={isCreation}
          menuName={menu?.name}
        />
        <MenuCategories disabled={isCreation} menu={menu} />
      </div>
      <ItemList
        items={menu?.items}
        categories={menu?.categories}
        restaurantId={restaurantId}
        menuId={menu?.id || ""}
      />
    </main>
  );
}
