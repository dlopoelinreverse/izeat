"use client";

import {
  CreateMenuDocument,
  GetMenusDocument,
  GetMenusQuery,
} from "@/graphql/__generated__/graphql";
import { useMutation } from "@apollo/client/react";
import { Plus, X, Type } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useOnboarding } from "@/contexts/onboarding-context";
import { useForm } from "@tanstack/react-form";

interface CreateMenuProps {
  restaurantId: string;
}

export const CreateMenu = ({ restaurantId }: CreateMenuProps) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { refetchOnboarding } = useOnboarding();

  const form = useForm({
    defaultValues: { name: "" },
    onSubmit: async ({ value }) => {
      await createMenu({ variables: { restaurantId, name: value.name } });
    },
  });

  const [createMenu, { loading }] = useMutation(CreateMenuDocument, {
    onCompleted: () => {
      toast.success("Menu créé avec succès");
      setOpen(false);
      form.reset();
      refetchOnboarding();
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message || "Erreur lors de la création du menu");
    },
    update: (cache, { data }) => {
      const existingData = cache.readQuery<GetMenusQuery>({
        query: GetMenusDocument,
        variables: { restaurantId },
      });

      if (existingData && data?.createMenu) {
        cache.writeQuery({
          query: GetMenusDocument,
          variables: { restaurantId },
          data: {
            getMenus: [
              ...existingData.getMenus,
              { ...data.createMenu, isActive: false },
            ],
          },
        });
      }
    },
  });

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        Ajouter un menu
      </Button>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="max-h-[96vh]">
          <div className="mx-auto w-full max-w-md flex flex-col h-full overflow-hidden">
            <DrawerHeader className="relative border-b pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <DrawerTitle className="text-xl font-bold">
                    Nouveau Menu
                  </DrawerTitle>
                  <DrawerDescription className="text-muted-foreground mt-1">
                    Donnez un nom à votre nouveau menu.
                  </DrawerDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-8 w-8"
                  onClick={() => setOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DrawerHeader>

            <form
              id="create-menu-form"
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
              className="flex flex-col flex-1 p-6"
            >
              <div className="space-y-6 flex-1">
                <form.Field
                  name="name"
                  validators={{
                    onBlur: ({ value }) =>
                      !value.trim() ? "Le nom du menu est requis." : undefined,
                    onSubmit: ({ value }) =>
                      !value.trim() ? "Le nom du menu est requis." : undefined,
                  }}
                >
                  {(field) => (
                    <div className="space-y-2">
                      <Label
                        htmlFor="menu-name"
                        className="text-sm font-medium flex items-center gap-2"
                      >
                        <Type className="h-4 w-4 text-primary" />
                        Nom du menu
                      </Label>
                      <Input
                        id="menu-name"
                        placeholder="Ex: Menu du Midi, Carte du soir..."
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="h-11 transition-all focus:ring-2 focus:ring-primary/20"
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
              </div>

              <DrawerFooter className="px-0 pt-6 gap-3 flex-row sm:flex-row border-t mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="flex-1 h-11"
                  disabled={loading}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  form="create-menu-form"
                  className="flex-1 h-11 font-semibold"
                  disabled={loading}
                >
                  {loading ? "Création..." : "Créer le menu"}
                </Button>
              </DrawerFooter>
            </form>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};
