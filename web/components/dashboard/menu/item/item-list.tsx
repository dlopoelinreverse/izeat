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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChefHat } from "lucide-react";

export const ItemList = ({
  items,
  categories,
  restaurantId,
  menuId,
}: ItemListProps) => {
  const [categoryId] = useQueryState("categoryId");

  const filteredItems = items?.filter((item) => item.categoryId === categoryId);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full content-start">
      <AddItem
        categoryId={categoryId}
        categories={categories}
        restaurantId={restaurantId}
        menuId={menuId}
      />
      {filteredItems?.map((item) => (
        <Card
          key={item.id}
          className="group hover:shadow-md transition-all cursor-pointer border-muted w-full max-w-[280px] h-[150px] flex flex-col"
        >
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">
                {item.name}
              </CardTitle>
              <ChefHat className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-secondary text-[10px] font-bold">
                  {item.ingredients?.length || 0}
                </span>
                <span>
                  ingrédient{item.ingredients?.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
