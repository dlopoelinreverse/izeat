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

  console.log(category);
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
        <div className="rounded-md border px-4 py-2 text-sm">
          <p className="font-medium">Shipping address</p>
          <p className="text-muted-foreground">100 Market St, San Francisco</p>
        </div>
        <div className="rounded-md border px-4 py-2 text-sm">
          <p className="font-medium">Items</p>
          <p className="text-muted-foreground">2x Studio Headphones</p>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
