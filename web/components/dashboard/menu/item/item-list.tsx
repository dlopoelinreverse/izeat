"use client";
import { GetMenuQuery } from "@/graphql/__generated__/graphql";
import { useQueryState } from "nuqs";
import { AddItem } from "./add-item";

interface ItemListProps {
  items?: GetMenuQuery["getMenu"]["items"];
  categories?: GetMenuQuery["getMenu"]["categories"];
  restaurantId: string;
  menuId: string;
}

export const ItemList = ({
  items,
  categories,
  restaurantId,
  menuId,
}: ItemListProps) => {
  const [categoryId] = useQueryState("categoryId");

  return (
    <ul className="flex flex-wrap gap-4 w-full h-full">
      <AddItem
        categoryId={categoryId}
        categories={categories}
        restaurantId={restaurantId}
        menuId={menuId}
      />
      {items
        ?.filter((item) => item.categoryId === categoryId)
        .map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
    </ul>
  );
};
