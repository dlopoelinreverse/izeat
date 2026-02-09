"use client";
import {
  CreateMenuCategoryDocument,
  GetMenuCategoriesDocument,
  // GetMenuCategoriesDocument,
  // GetMenuDocument,
  GetMenuQuery,
} from "@/graphql/__generated__/graphql";
import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";

interface CreateMenuCategoryProps {
  menu: GetMenuQuery["getMenu"];
}

export const CreateMenuCategory = ({ menu }: CreateMenuCategoryProps) => {
  const [open, setOpen] = useState(false);

  const { id: menuId } = menu;

  const [createMenuCategory] = useMutation(CreateMenuCategoryDocument, {
    onCompleted: () => {
      setOpen(false);
    },
    update(cache, { data }) {
      if (!data?.createMenuCategory) return;
      const existingMenuCategories = cache.readQuery({
        query: GetMenuCategoriesDocument,
        variables: {
          menuId,
        },
      });

      if (!existingMenuCategories) return;
      const existingCategories = existingMenuCategories.getMenuCategories;
      const newCategories = [...existingCategories, data.createMenuCategory];
      cache.writeQuery({
        query: GetMenuCategoriesDocument,
        variables: {
          menuId,
        },
        data: {
          getMenuCategories: newCategories,
        },
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    if (!name) {
      return;
    }
    createMenuCategory({
      variables: {
        name,
        menuId,
      },
    });
  };

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <Plus /> Ajouter une catégorie
      </Button>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="max-h-[96vh] p-4">
          <div className="mx-auto w-full max-w-md flex flex-col h-full ">
            <DrawerHeader>
              <DrawerTitle>Ajouter une catégorie</DrawerTitle>
              <DrawerDescription>
                Ajoutez une catégorie à votre menu
              </DrawerDescription>
            </DrawerHeader>
            <form
              className="flex flex-col gap-4 w-full"
              onSubmit={handleSubmit}
            >
              <Input placeholder="Nom de la categorie" name="name" />
              <DrawerFooter className="flex-1 p-0">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setOpen(false)}
                >
                  Annuler
                </Button>
                <Button type="submit">Ajouter</Button>
              </DrawerFooter>
            </form>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};
