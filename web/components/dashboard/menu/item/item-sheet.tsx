import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CreateMenuItemDocument,
  GetMenuCategoriesDocument,
  UpdateMenuItemDocument,
  GetMenuItemDocument,
} from "@/graphql/__generated__/graphql";
import { useMutation, useQuery } from "@apollo/client/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IngredientsList } from "../../ingredient/ingredients-list";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { DeleteItemButton } from "./delete-item-button";

interface ItemSheetProps {
  categoryId?: string;
  restaurantId?: string;
  menuId?: string;
  itemId?: string;
  variant: "CREATE" | "EDIT";
}

export const ItemSheet = ({
  categoryId,
  restaurantId,
  menuId,
  itemId,
  variant,
}: ItemSheetProps) => {
  const [open, setOpen] = useState(false);

  const { data } = useQuery(GetMenuItemDocument, {
    variables: { id: itemId || "" },
    skip: !itemId,
  });

  const [selectedIngredients, setSelectedIngredients] = useState(() => {
    if (!data?.getMenuItem) return [];
    return data.getMenuItem.ingredients.map(
      (ingredient) => ingredient.ingredient,
    );
  });

  const [createMenuItem] = useMutation(CreateMenuItemDocument, {
    onCompleted: () => {
      setOpen(false);
      setSelectedIngredients([]);
    },
    update: (cache, { data }) => {
      if (!data?.createMenuItem || !menuId || !categoryId) return;

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

  const [updateMenuItem] = useMutation(UpdateMenuItemDocument, {
    onCompleted: () => {
      setOpen(false);
    },
    update: (cache, { data }) => {
      if (!data?.updateMenuItem || !menuId) return;

      const existing = cache.readQuery({
        query: GetMenuCategoriesDocument,
        variables: { menuId },
      });

      if (!existing) return;

      const updatedItem = data.updateMenuItem;

      const categoriesWithoutItem = existing.getMenuCategories.map(
        (category) => ({
          ...category,
          items: category.items?.filter((item) => item.id !== updatedItem.id),
        }),
      );

      const newCategories = categoriesWithoutItem.map((category) => {
        if (category.id === updatedItem.categoryId) {
          return {
            ...category,
            items: [...(category.items || []), updatedItem],
          };
        }
        return category;
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

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price") as string;

    if (variant === "EDIT" && itemId) {
      const itemData = data?.getMenuItem;
      updateMenuItem({
        variables: {
          id: itemId,
          menuItemInput: {
            name,
            description,
            price: parseFloat(price),
            ingredientsId: selectedIngredients.map((i) => i.id),
            categoryId: categoryId || itemData?.categoryId || "",
            menuId: menuId || "",
            restaurantId: restaurantId || "",
          },
        },
      });
    } else {
      if (!categoryId || !menuId || !restaurantId) return;
      createMenuItem({
        variables: {
          menuItemInput: {
            name,
            description,
            price: parseFloat(price),
            ingredientsId: selectedIngredients.map((i) => i.id),
            categoryId,
            menuId,
            restaurantId,
          },
        },
      });
    }
  };

  const isEdit = variant === "EDIT";

  const itemData = data?.getMenuItem;

  return (
    <>
      {itemData ? (
        <div
          onClick={() => setOpen(true)}
          className="rounded-md border px-4 py-2 text-sm flex justify-between items-center hover:bg-accent cursor-pointer"
        >
          <p className="font-medium">{itemData.name}</p>
        </div>
      ) : (
        <Button variant="outline" onClick={() => setOpen(true)}>
          <span className="hidden sm:inline">
            {isEdit ? "Modifier" : "Ajouter un plat"}
          </span>
        </Button>
      )}

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full sm:max-w-[600px] p-0 gap-0">
          <SheetHeader className="p-6">
            <SheetTitle>
              {isEdit ? "Modifier le plat" : "Ajouter un plat"}
            </SheetTitle>
          </SheetHeader>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col flex-1 overflow-hidden"
          >
            <div className="flex-1 overflow-y-auto px-6 py-2 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="item-name">Nom du plat</Label>
                <Input
                  id="item-name"
                  name="name"
                  placeholder="Ex: Pizza Margherita"
                  defaultValue={data?.getMenuItem?.name || ""}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Ingrédients</Label>
                <IngredientsList
                  restaurantId={restaurantId || ""}
                  selectedIngredients={selectedIngredients}
                  onIngredientsChange={setSelectedIngredients}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="item-price">Prix</Label>
                <Input
                  id="item-price"
                  name="price"
                  placeholder="Ex: 10.00"
                  type="number"
                  step="0.05"
                  defaultValue={data?.getMenuItem?.price || ""}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="item-description">Description</Label>
                <Textarea
                  id="item-description"
                  name="description"
                  placeholder="Ex: Une délicieuse pizza..."
                  className="min-h-[100px]"
                  defaultValue={data?.getMenuItem?.description || ""}
                />
              </div>
            </div>

            <SheetFooter className="p-6">
              <div className="flex flex-col gap-2 w-full">
                <Button type="submit" className="w-full">
                  {isEdit ? "Modifier" : "Ajouter le plat"}
                </Button>
                {isEdit && itemId && menuId && (
                  <DeleteItemButton
                    itemId={itemId}
                    menuId={menuId}
                    setOpen={setOpen}
                  />
                )}
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setOpen(false)}
                  className="w-full"
                >
                  Annuler
                </Button>
              </div>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
};
