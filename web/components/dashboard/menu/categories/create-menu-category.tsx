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
import { Label } from "@/components/ui/label";
import { useOnboarding } from "@/contexts/onboarding-context";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";

interface CreateMenuCategoryProps {
  menu: GetMenuQuery["getMenu"];
  restaurantId: string;
}

export const CreateMenuCategory = ({ menu, restaurantId }: CreateMenuCategoryProps) => {
  const [open, setOpen] = useState(false);
  const { refetchOnboarding } = useOnboarding();

  const { id: menuId } = menu;

  const form = useForm({
    defaultValues: { name: "" },
    onSubmit: async ({ value }) => {
      await createMenuCategory({ variables: { name: value.name, menuId } });
    },
  });

  const [createMenuCategory] = useMutation(CreateMenuCategoryDocument, {
    onCompleted: () => {
      toast.success("Catégorie créée avec succès");
      setOpen(false);
      form.reset();
      refetchOnboarding();
    },
    onError: (error) => {
      toast.error(error.message || "Erreur lors de la création de la catégorie");
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

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <Plus />{" "}
        <span className="text-xs sm:text-sm">Ajouter une catégorie</span>
      </Button>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="max-h-[96vh] p-4">
          <div className="mx-auto w-full max-w-md flex flex-col h-full">
            <DrawerHeader>
              <DrawerTitle>Ajouter une catégorie</DrawerTitle>
              <DrawerDescription>
                Ajoutez une catégorie à votre menu
              </DrawerDescription>
            </DrawerHeader>
            <form
              id="create-category-form"
              className="flex flex-col gap-4 w-full"
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
            >
              <form.Field
                name="name"
                validators={{
                  onBlur: ({ value }) =>
                    !value.trim() ? "Le nom de la catégorie est requis." : undefined,
                  onSubmit: ({ value }) =>
                    !value.trim() ? "Le nom de la catégorie est requis." : undefined,
                }}
              >
                {(field) => (
                  <div className="space-y-1">
                    <Label htmlFor="category-name">Nom de la catégorie</Label>
                    <Input
                      id="category-name"
                      placeholder="Nom de la catégorie"
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
              <DrawerFooter className="flex-1 p-0">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setOpen(false)}
                >
                  Annuler
                </Button>
                <Button type="submit" form="create-category-form">Ajouter</Button>
              </DrawerFooter>
            </form>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};
