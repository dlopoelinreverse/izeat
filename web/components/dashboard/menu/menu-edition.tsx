import { GetMenuQuery } from "@/graphql/__generated__/graphql";
import { CategoriesList } from "./categories/categories-list";

interface MenuEditionProps {
  menu: GetMenuQuery["getMenu"];
  restaurantId: string;
}

export const MenuEdition = ({ menu, restaurantId }: MenuEditionProps) => {
  return (
    <div className="min-h-full w-full px-4">
      <p>Les categories de {menu?.name} :</p>
      <div className="flex flex-wrap gap-4 justify-start">
        <CategoriesList menuId={menu.id} restaurantId={restaurantId} />
      </div>
    </div>
  );
};
