"use client";

import {
  CreateMenuDocument,
  GetMenusDocument,
  GetMenusQuery,
} from "@/graphql/__generated__/graphql";
import { useMutation } from "@apollo/client/react";
import { Type } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOnboarding } from "@/contexts/onboarding-context";
import { useForm } from "@tanstack/react-form";

interface CreateMenuProps {
  restaurantId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateMenu = ({ restaurantId, open, onOpenChange }: CreateMenuProps) => {
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
      onOpenChange(false);
      form.reset();
      refetchOnboarding();
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Nouveau menu</DialogTitle>
          <DialogDescription>Donnez un nom à votre nouveau menu.</DialogDescription>
        </DialogHeader>
        <form
          id="create-menu-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex flex-col gap-4 pt-2"
        >
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
            <Button
              variant="outline"
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button type="submit" form="create-menu-form" disabled={loading}>
              {loading ? "Création..." : "Créer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
