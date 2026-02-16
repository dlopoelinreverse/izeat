"use client";

import { GetMenuCategoriesDocument } from "@/graphql/__generated__/graphql";
import { useQuery } from "@apollo/client/react";
import { EmptyState } from "../../empty-state";

import { Category } from "./category";

export const CategoriesList = ({
  menuId,
  restaurantId,
}: {
  menuId: string;
  restaurantId: string;
}) => {
  const { data, loading, error } = useQuery(GetMenuCategoriesDocument, {
    variables: {
      menuId,
    },
  });

  const categories = data?.getMenuCategories;

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (!categories || categories.length === 0) {
    return (
      <EmptyState
        title="Aucune catégorie"
        description="Aucune catégorie n'a été ajoutée à ce menu"
      />
    );
  }

  return (
    <ul className="flex flex-col gap-4 w-full">
      {categories.map((category) => (
        <Category
          key={category.id}
          category={category}
          menuId={menuId}
          restaurantId={restaurantId}
        />
      ))}
    </ul>
  );
};
