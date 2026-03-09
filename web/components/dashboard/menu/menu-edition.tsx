import { GetMenuQuery } from "@/graphql/__generated__/graphql";
import { CategoriesList } from "./categories/categories-list";

interface MenuEditionProps {
  menu: GetMenuQuery["getMenu"];
  restaurantId: string;
}

export const MenuEdition = ({ menu, restaurantId }: MenuEditionProps) => {
  return (
    <div className="flex flex-col gap-2 p-4 md:p-6">
      <CategoriesList menuId={menu.id} restaurantId={restaurantId} />
    </div>
  );
};
