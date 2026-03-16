"use client";

import { useEffect, useState, startTransition } from "react";
import { Button } from "@/components/ui/button";
import { useOnboarding } from "@/contexts/onboarding-context";
import {
  CreateDishAndMenuItemDocument,
  GetMenuCategoriesDocument,
  GetMenusDocument,
  type GetMenusQuery,
  UpdateDishDocument,
  GetMenuItemDocument,
} from "@/graphql/__generated__/graphql";
import { useMutation, useQuery } from "@apollo/client/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  IngredientsList,
  IngredientType,
} from "../../ingredient/ingredients-list";
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
import { Plus } from "lucide-react";

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

  const [selectedIngredients, setSelectedIngredients] = useState<
    IngredientType[]
  >([]);

  const form = useForm({
    defaultValues: { name: "", price: "", description: "" },
    onSubmit: async ({ value }) => {
      if (variant === "EDIT" && itemId) {
        const itemData = data?.getMenuItem;
        const dishId = itemData?.dishId;
        if (!dishId) return;
        await updateDish({
          variables: {
            updateDishInput: {
              id: dishId,
              name: value.name,
              description: value.description,
              price: parseFloat(value.price),
              ingredientsId: selectedIngredients.map((i) => i.id),
            },
          },
        });
      } else {
        if (!categoryId || !menuId || !restaurantId) return;
        await createDishAndMenuItem({
          variables: {
            input: {
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
    if (data?.getMenuItem && open) {
      startTransition(() => {
        setSelectedIngredients(
          (data.getMenuItem!.dish.ingredients ?? []).map((i) => i.ingredient),
        );
      });
    }
  }, [data, open]);

  const [createDishAndMenuItem] = useMutation(CreateDishAndMenuItemDocument, {
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
      if (!data?.createDishAndMenuItem || !menuId || !categoryId) return;

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
          items: [...(category.items ?? []), data.createDishAndMenuItem],
        };
      });

      cache.writeQuery({
        query: GetMenuCategoriesDocument,
        variables: { menuId },
        data: {
          getMenuCategories: newCategories,
        },
      });

      // Update GetMenusDocument to keep menu card item count in sync
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
                    items: [
                      ...(m.items ?? []),
                      {
                        __typename: "MenuItem" as const,
                        id: data.createDishAndMenuItem.id,
                      },
                    ],
                  }
                : m,
            ),
          },
        });
      }
    },
  });

  const [updateDish] = useMutation(UpdateDishDocument, {
    onCompleted: () => {
      toast.success("Plat mis à jour avec succès");
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || "Erreur lors de la mise à jour du plat");
    },
    refetchQueries: menuId
      ? [{ query: GetMenuCategoriesDocument, variables: { menuId } }]
      : [],
  });

  const isEdit = variant === "EDIT";
  const itemData = data?.getMenuItem;

  return (
    <>
      {isEdit ? (
        <div
          onClick={() => setOpen(true)}
          className="bg-card border border-border rounded-xl p-4 cursor-pointer hover:shadow-sm transition-shadow flex flex-col gap-2 group"
        >
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold text-foreground leading-tight">
              {itemData?.dish?.name}
            </p>
            <span className="text-sm font-semibold tabular-nums text-foreground shrink-0">
              {(itemData?.priceOverride ?? itemData?.dish?.price)?.toFixed(2)} €
            </span>
          </div>
          {itemData?.dish?.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {itemData.dish?.description}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-auto opacity-0 group-hover:opacity-100 transition-opacity">
            Cliquer pour modifier
          </p>
        </div>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-foreground shrink-0"
          onClick={() => setOpen(true)}
        >
          <Plus className="size-3.5" />
        </Button>
      )}

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full sm:max-w-[520px] p-0 gap-0 flex flex-col">
          <SheetHeader className="px-6 pt-6 pb-4 border-b shrink-0">
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
            <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
              <form.Field
                name="name"
                validators={{
                  onBlur: ({ value }) =>
                    !value.trim() ? "Le nom du plat est requis." : undefined,
                  onSubmit: ({ value }) =>
                    !value.trim() ? "Le nom du plat est requis." : undefined,
                }}
                defaultValue={data?.getMenuItem?.dish.name || ""}
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

              <form.Field
                name="price"
                validators={{
                  onBlur: ({ value }) => {
                    if (!value) return "Le prix est requis.";
                    const n = parseFloat(value);
                    if (isNaN(n) || n <= 0)
                      return "Le prix doit être un nombre positif.";
                    return undefined;
                  },
                  onSubmit: ({ value }) => {
                    if (!value) return "Le prix est requis.";
                    const n = parseFloat(value);
                    if (isNaN(n) || n <= 0)
                      return "Le prix doit être un nombre positif.";
                    return undefined;
                  },
                }}
                defaultValue={String(data?.getMenuItem?.dish.price || "")}
              >
                {(field) => (
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="item-price">Prix</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        €
                      </span>
                      <Input
                        id="item-price"
                        placeholder="10.00"
                        type="number"
                        step="0.05"
                        className="pl-7"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </div>
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-sm text-red-500">
                        {String(field.state.meta.errors[0])}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>

              <form.Field
                name="description"
                defaultValue={data?.getMenuItem?.dish.description || ""}
              >
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

              <div className="flex flex-col gap-2">
                <Label>Ingrédients</Label>
                <IngredientsList
                  restaurantId={restaurantId || ""}
                  selectedIngredients={selectedIngredients}
                  onIngredientsChange={setSelectedIngredients}
                />
              </div>
            </div>

            <SheetFooter className="px-6 py-4 border-t shrink-0">
              <div className="flex flex-col gap-2 w-full">
                <Button type="submit" form="item-sheet-form" className="w-full">
                  {isEdit ? "Enregistrer les modifications" : "Ajouter le plat"}
                </Button>
                {isEdit && itemId && menuId && (
                  <DeleteItemButton
                    itemId={itemId}
                    menuId={menuId}
                    restaurantId={restaurantId || ""}
                    dishId={itemData?.dishId}
                    itemName={itemData?.dish?.name}
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
