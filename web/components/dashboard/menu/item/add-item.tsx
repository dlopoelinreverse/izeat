import { useState, useEffect, useMemo } from "react";
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
import {
  IngredientType,
  IngredientsList,
} from "../../ingredient/ingredients-list";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Plus, Pencil } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface AddItemProps {
  categoryId?: string;
  restaurantId?: string;
  menuId?: string;
  itemId?: string;
  trigger?: React.ReactNode;
}

export const AddItem = ({
  categoryId,
  restaurantId,
  menuId,
  itemId,
  trigger,
}: AddItemProps) => {
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
    onError: (error) => {
      console.error(error);
    },
  });

  const [updateMenuItem] = useMutation(UpdateMenuItemDocument, {
    onCompleted: () => {
      setOpen(false);
    },
    refetchQueries: menuId
      ? [{ query: GetMenuCategoriesDocument, variables: { menuId } }]
      : [],
    onError: (error) => {
      console.error(error);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price") as string;

    if (itemId) {
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

  const isEdit = !!itemId;

  return (
    <>
      {trigger ? (
        <div onClick={() => setOpen(true)}>{trigger}</div>
      ) : (
        <Button variant="outline" onClick={() => setOpen(true)}>
          {isEdit ? <Pencil className="size-4" /> : <Plus />}
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
                {isEdit && (
                  <Button
                    variant="destructive"
                    type="button"
                    className="w-full"
                  >
                    Supprimer le plat
                  </Button>
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
