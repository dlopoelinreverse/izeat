"use client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { GetMenuQuery } from "@/graphql/__generated__/graphql";
import { Dialog } from "@radix-ui/react-dialog";
import clsx from "clsx";
import { useQueryState } from "nuqs";
import { useState } from "react";

interface ItemListProps {
  items?: GetMenuQuery["getMenu"]["items"];
  categories?: GetMenuQuery["getMenu"]["categories"];
}

export const ItemList = ({ items, categories }: ItemListProps) => {
  const [open, setOpen] = useState(false);
  const [categoryId] = useQueryState("categoryId");

  const onOpenChange = (open: boolean) => {
    setOpen(open);
  };

  return (
    <>
      <ul className="flex flex-wrap gap-4 w-full h-full bg-amber-50">
        <Card
          className={clsx(
            "h-1/5 cursor-pointer hover:bg-amber-100 transition-colors",
            !categoryId && "opacity-50 cursor-not-allowed"
          )}
          onClick={() => {
            if (categoryId) setOpen(true);
          }}
        >
          <CardContent className="flex flex-col items-center justify-between h-full  ">
            Ajouter un plat
            <CardFooter>
              a la categorie{" "}
              {categories?.find((category) => category.id === categoryId)?.name}
            </CardFooter>
          </CardContent>
        </Card>

        {items
          ?.filter((item) => item.categoryId === categoryId)
          .map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
      </ul>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogTitle>Ajouter un plat</DialogTitle>
          <DialogDescription>
            Ajouter un plat a la categorie{" "}
            {categories?.find((category) => category.id === categoryId)?.name}
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  );
};
