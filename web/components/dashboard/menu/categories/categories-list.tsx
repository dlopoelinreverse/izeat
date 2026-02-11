"use client";

import { GetMenuCategoriesDocument } from "@/graphql/__generated__/graphql";
import { useQuery } from "@apollo/client/react";
import { Category } from "./category";

export const CategoriesList = ({
  menuId,
  restaurantId,
}: {
  menuId: string;
  restaurantId: string;
}) => {
  const { data } = useQuery(GetMenuCategoriesDocument, {
    variables: {
      menuId,
    },
  });

  const categories = data?.getMenuCategories;

  console.log(categories);

  return (
    <ul className="flex flex-col gap-4 w-full">
      {categories?.map((category) => (
        <Category
          key={category.id}
          category={category}
          restaurantId={restaurantId}
          menuId={menuId}
        />
      ))}
    </ul>
  );
};
