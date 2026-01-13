"use client";
import { GetMenuQuery } from "@/graphql/__generated__/graphql";
import { useQueryState } from "nuqs";
import { AddItem } from "./add-item";

interface ItemListProps {
  items?: GetMenuQuery["getMenu"]["items"];
  categories?: GetMenuQuery["getMenu"]["categories"];
  restaurantId: string;
}

export const ItemList = ({
  items,
  categories,
  restaurantId,
}: ItemListProps) => {
  const [categoryId] = useQueryState("categoryId");

  return (
    <ul className="flex flex-wrap gap-4 w-full h-full">
      <AddItem
        categoryId={categoryId}
        categories={categories}
        restaurantId={restaurantId}
      />
      {items
        ?.filter((item) => item.categoryId === categoryId)
        .map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
    </ul>
  );
};
