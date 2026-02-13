"use client";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { GetMenuCategoriesQuery } from "@/graphql/__generated__/graphql";
import { ChevronsUpDown, Plus } from "lucide-react";
import { useState } from "react";
import { AddItem } from "../item/add-item";

export const Category = ({
  category,
  restaurantId,
  menuId,
}: {
  category: GetMenuCategoriesQuery["getMenuCategories"][number];
  restaurantId: string;
  menuId: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="flex  flex-col gap-2"
    >
      <div className="flex items-center justify-between rounded-md border px-4 py-2 text-sm bg-accent">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-semibold">{category.name}</h4>
          {category.items?.length ? (
            <p>
              {category.items?.length} plat
              {category.items?.length > 1 ? "s" : ""}
            </p>
          ) : (
            <p>Aucun plat</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <AddItem
            menuId={menuId}
            categoryId={category.id}
            restaurantId={restaurantId}
          />
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <ChevronsUpDown />
              <span className="sr-only">Toggle details</span>
            </Button>
          </CollapsibleTrigger>
        </div>
      </div>

      <CollapsibleContent className="flex flex-col gap-2">
        {category.items && category.items.length > 0 ? (
          category.items.map((item) => (
            <div
              key={item.id}
              className="rounded-md border px-4 py-2 text-sm flex justify-between items-center"
            >
              <p className="font-medium">{item.name}</p>
            </div>
          ))
        ) : (
          <div className="rounded-md border px-4 py-2 text-sm text-muted-foreground w-full text-center bg-muted/50">
            Aucun plat dans cette catégorie
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};
