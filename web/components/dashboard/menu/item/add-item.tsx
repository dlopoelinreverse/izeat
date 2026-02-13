import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CreateMenuItemDocument,
  GetMenuCategoriesDocument,
} from "@/graphql/__generated__/graphql";
import { useMutation } from "@apollo/client/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  IngredientType,
  IngredientsList,
} from "../../ingredient/ingredients-list";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Plus } from "lucide-react";

interface AddItemProps {
  categoryId: string;
  restaurantId: string;
  menuId: string;
}

export const AddItem = ({ categoryId, restaurantId, menuId }: AddItemProps) => {
  const [open, setOpen] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState<
    IngredientType[]
  >([]);

  const [createMenuItem, { error }] = useMutation(CreateMenuItemDocument, {
    onCompleted: () => {
      setOpen(false);
      setSelectedIngredients([]);
    },
    update: (cache, { data }) => {
      if (!data?.createMenuItem) return;

      const existing = cache.readQuery({
        query: GetMenuCategoriesDocument,
        variables: { menuId },
      });

      if (!existing) return;

      const newCategories = existing.getMenuCategories.map((category) => {
        if (category.id !== categoryId) return category;

        return {
          ...category,
          __typename: category.__typename,
          items: [...(category.items ?? []), data.createMenuItem],
        };
      });

      cache.writeQuery({
        query: GetMenuCategoriesDocument,
        variables: { menuId },
        data: {
          getMenuCategories: newCategories,
        },
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!categoryId) return;

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;

    createMenuItem({
      variables: {
        menuItemInput: {
          name,
          ingredientsId: selectedIngredients.map((i) => i.id),
          categoryId,
          menuId,
          restaurantId,
        },
      },
    });
  };

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <Plus />
        <span>Ajouter un plat</span>
      </Button>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="max-h-[96vh]">
          <div className="mx-auto w-full max-w-[800px] flex flex-col h-full overflow-hidden">
            <DrawerHeader>
              <DrawerTitle>Ajouter un plat</DrawerTitle>
            </DrawerHeader>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col flex-1 overflow-hidden"
            >
              <div className="flex-1 overflow-y-auto px-4 py-2 flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="item-name">Nom du plat</Label>
                  <Input
                    id="item-name"
                    name="name"
                    placeholder="Ex: Pizza Margherita"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Ingrédients</Label>
                  <IngredientsList
                    restaurantId={restaurantId}
                    selectedIngredients={selectedIngredients}
                    onIngredientsChange={setSelectedIngredients}
                  />
                </div>
              </div>

              <DrawerFooter>
                <div className="flex flex-col gap-2 w-full">
                  <Button type="submit" className="w-full">
                    Ajouter le plat
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setOpen(false)}
                    className="w-full"
                  >
                    Annuler
                  </Button>
                </div>
              </DrawerFooter>
            </form>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};
