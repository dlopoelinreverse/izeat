import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useOnboarding } from "@/contexts/onboarding-context";
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
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";

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
  const { refetchOnboarding } = useOnboarding();

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

  const form = useForm({
    defaultValues: { name: "", price: "", description: "" },
    onSubmit: async ({ value }) => {
      if (variant === "EDIT" && itemId) {
        const itemData = data?.getMenuItem;
        await updateMenuItem({
          variables: {
            id: itemId,
            menuItemInput: {
              name: value.name,
              description: value.description,
              price: parseFloat(value.price),
              ingredientsId: selectedIngredients.map((i) => i.id),
              categoryId: categoryId || itemData?.categoryId || "",
              menuId: menuId || "",
              restaurantId: restaurantId || "",
            },
          },
        });
      } else {
        if (!categoryId || !menuId || !restaurantId) return;
        await createMenuItem({
          variables: {
            menuItemInput: {
              name: value.name,
              description: value.description,
              price: parseFloat(value.price),
              ingredientsId: selectedIngredients.map((i) => i.id),
              categoryId,
              menuId,
              restaurantId,
            },
          },
        });
      }
    },
  });

  // Populate form when editing and data loads
  useEffect(() => {
    if (data?.getMenuItem) {
      form.reset({
        name: data.getMenuItem.name,
        price: String(data.getMenuItem.price),
        description: data.getMenuItem.description ?? "",
      });
      setSelectedIngredients(
        data.getMenuItem.ingredients.map((i) => i.ingredient),
      );
    }
  }, [data]);

  const [createMenuItem] = useMutation(CreateMenuItemDocument, {
    onCompleted: () => {
      toast.success("Plat ajouté avec succès");
      setOpen(false);
      setSelectedIngredients([]);
      form.reset();
      refetchOnboarding();
    },
    onError: (error) => {
      toast.error(error.message || "Erreur lors de la création du plat");
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
      toast.success("Plat mis à jour avec succès");
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || "Erreur lors de la mise à jour du plat");
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
            id="item-sheet-form"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="flex flex-col flex-1 overflow-hidden"
          >
            <div className="flex-1 overflow-y-auto px-6 py-2 flex flex-col gap-4">
              <form.Field
                name="name"
                validators={{
                  onBlur: ({ value }) =>
                    !value.trim() ? "Le nom du plat est requis." : undefined,
                  onSubmit: ({ value }) =>
                    !value.trim() ? "Le nom du plat est requis." : undefined,
                }}
              >
                {(field) => (
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="item-name">Nom du plat</Label>
                    <Input
                      id="item-name"
                      placeholder="Ex: Pizza Margherita"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-sm text-red-500">
                        {String(field.state.meta.errors[0])}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>

              <div className="flex flex-col gap-2">
                <Label>Ingrédients</Label>
                <IngredientsList
                  restaurantId={restaurantId || ""}
                  selectedIngredients={selectedIngredients}
                  onIngredientsChange={setSelectedIngredients}
                />
              </div>

              <form.Field
                name="price"
                validators={{
                  onBlur: ({ value }) => {
                    if (!value) return "Le prix est requis.";
                    const n = parseFloat(value);
                    if (isNaN(n) || n <= 0) return "Le prix doit être un nombre positif.";
                    return undefined;
                  },
                  onSubmit: ({ value }) => {
                    if (!value) return "Le prix est requis.";
                    const n = parseFloat(value);
                    if (isNaN(n) || n <= 0) return "Le prix doit être un nombre positif.";
                    return undefined;
                  },
                }}
              >
                {(field) => (
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="item-price">Prix</Label>
                    <Input
                      id="item-price"
                      placeholder="Ex: 10.00"
                      type="number"
                      step="0.05"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-sm text-red-500">
                        {String(field.state.meta.errors[0])}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>

              <form.Field name="description">
                {(field) => (
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="item-description">Description</Label>
                    <Textarea
                      id="item-description"
                      placeholder="Ex: Une délicieuse pizza..."
                      className="min-h-[100px]"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </div>
                )}
              </form.Field>
            </div>

            <SheetFooter className="p-6">
              <div className="flex flex-col gap-2 w-full">
                <Button type="submit" form="item-sheet-form" className="w-full">
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
