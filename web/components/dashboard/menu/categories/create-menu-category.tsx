"use client";
import {
  CreateMenuCategoryDocument,
  GetMenuCategoriesDocument,
  GetMenusDocument,
  GetMenusQuery,
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
import { useOnboarding } from "@/contexts/onboarding-context";

interface CreateMenuCategoryProps {
  menu: GetMenuQuery["getMenu"];
  restaurantId: string;
}

export const CreateMenuCategory = ({ menu, restaurantId }: CreateMenuCategoryProps) => {
  const [open, setOpen] = useState(false);
  const { refetchOnboarding } = useOnboarding();

  const { id: menuId } = menu;

  const [createMenuCategory] = useMutation(CreateMenuCategoryDocument, {
    onCompleted: () => {
      setOpen(false);
      refetchOnboarding();
    },
    update(cache, { data }) {
      if (!data?.createMenuCategory) return;

      const existingMenuCategories = cache.readQuery({
        query: GetMenuCategoriesDocument,
        variables: { menuId },
      });
      if (existingMenuCategories) {
        cache.writeQuery({
          query: GetMenuCategoriesDocument,
          variables: { menuId },
          data: {
            getMenuCategories: [
              ...existingMenuCategories.getMenuCategories,
              data.createMenuCategory,
            ],
          },
        });
      }

      const existingMenus = cache.readQuery<GetMenusQuery>({
        query: GetMenusDocument,
        variables: { restaurantId },
      });
      if (existingMenus) {
        cache.writeQuery({
          query: GetMenusDocument,
          variables: { restaurantId },
          data: {
            getMenus: existingMenus.getMenus.map((m) =>
              m.id === menuId
                ? {
                    ...m,
                    categories: [
                      ...(m.categories ?? []),
                      { __typename: "MenuCategory" as const, id: data.createMenuCategory.id },
                    ],
                  }
                : m
            ),
          },
        });
      }
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
        <Plus />{" "}
        <span className="text-xs sm:text-sm">Ajouter une catégorie</span>
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
