import { GetMenuQuery } from "@/graphql/__generated__/graphql";
import { EmptyState } from "../empty-state";
import { CategoriesList } from "./categories/categories-list";

interface MenuEditionProps {
  menu: GetMenuQuery["getMenu"];
  restaurantId: string;
}

export type CategoryType = NonNullable<
  NonNullable<GetMenuQuery["getMenu"]>["categories"]
>[number];

export const MenuEdition = ({ menu, restaurantId }: MenuEditionProps) => {
  return (
    <div className="min-h-full w-full px-4">
      <p>Les categories de {menu?.name} :</p>
      <div className="flex flex-wrap gap-4 justify-start">
        {menu.categories?.length ? (
          <CategoriesList menuId={menu.id} restaurantId={restaurantId} />
        ) : (
          <EmptyState
            title="Aucune catégorie"
            description="Aucune catégorie n'a été ajoutée à ce menu"
          />
        )}
      </div>
    </div>
  );
};
