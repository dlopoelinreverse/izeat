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
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
              {
                ...data.createMenuCategory,
                order: existingMenuCategories.getMenuCategories.length,
                items: null,
              },
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
        <Plus />
        <span className="text-xs sm:text-sm">Ajouter une catégorie</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Nouvelle catégorie</DialogTitle>
          </DialogHeader>
          <form
            id="create-category-form"
            className="flex flex-col gap-4 pt-2"
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
                    autoFocus
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-red-500">
                      {String(field.state.meta.errors[0])}
                    </p>
                  )}
                </div>
              )}
            </form.Field>
            <DialogFooter className="gap-2">
              <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" form="create-category-form">Créer</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
