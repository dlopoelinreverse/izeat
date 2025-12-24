"use client";
import { Card, CardContent } from "@/components/ui/card";
import { GetMenuQuery } from "@/graphql/__generated__/graphql";
import { useQueryState } from "nuqs";

interface ItemListProps {
  items?: GetMenuQuery["getMenu"]["items"];
}

export const ItemList = ({ items }: ItemListProps) => {
  const [categoryId] = useQueryState("categoryId");
  return (
    <ul className="flex flex-wrap gap-4 w-full h-full bg-amber-50">
      <Card className="h-1/5">
        <CardContent className="flex items-center justify-center ">
          Ajouter un plat
        </CardContent>
      </Card>
      {items
        ?.filter((item) => item.categoryId === categoryId)
        .map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
    </ul>
  );
};
