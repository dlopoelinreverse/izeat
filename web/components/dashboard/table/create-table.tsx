"use client";

import {
  CreateTableDocument,
  GetRestaurantTablesDocument,
  GetRestaurantTablesQuery,
} from "@/graphql/__generated__/graphql";
import { useMutation } from "@apollo/client/react";
import { Hash, Users, Plus, X } from "lucide-react";
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
import { useOnboarding } from "@/contexts/onboarding-context";
import { useForm } from "@tanstack/react-form";

interface CreateTableProps {
  restaurantId: string;
  existingNumbers: number[];
}

export const CreateTable = ({ restaurantId, existingNumbers }: CreateTableProps) => {
  const { refetchOnboarding } = useOnboarding();
  const [open, setOpen] = useState(false);

  const form = useForm({
    defaultValues: { tableNumber: "", capacity: "" },
    onSubmit: async ({ value }) => {
      await createTable({
        variables: {
          tableInput: {
            restaurantId,
            number: parseInt(value.tableNumber),
            capacity: parseInt(value.capacity),
          },
        },
      });
    },
  });

  const [createTable, { loading }] = useMutation(CreateTableDocument, {
    onCompleted: () => {
      toast.success("Table ajoutée avec succès");
      setOpen(false);
      form.reset();
      refetchOnboarding();
    },
    onError: () => {
      toast.error(
        "Erreur lors de l'ajout de la table, vérifiez que le numéro de la table n'est pas déjà utilisé"
      );
    },
    update: (cache, { data }) => {
      const existingData = cache.readQuery<GetRestaurantTablesQuery>({
        query: GetRestaurantTablesDocument,
        variables: { restaurantId },
      });

      if (existingData && data?.createTable) {
        cache.writeQuery({
          query: GetRestaurantTablesDocument,
          variables: { restaurantId },
          data: {
            getRestaurantTables: [
              ...existingData.getRestaurantTables,
              data.createTable,
            ],
          },
        });
      }
    },
  });

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="gap-2 shadow-sm transition-all hover:scale-105"
      >
        <Plus className="h-4 w-4" />
        Ajouter une table
      </Button>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="max-h-[96svh]">
          <div className="mx-auto w-full max-w-md flex flex-col h-full overflow-hidden">
            <DrawerHeader className="relative border-b pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <DrawerTitle className="text-xl font-bold">
                    Nouvelle Table
                  </DrawerTitle>
                  <DrawerDescription className="text-muted-foreground mt-1">
                    Configurez une nouvelle table pour votre restaurant.
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
              id="create-table-form"
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
              className="flex flex-col flex-1 p-6"
            >
              <div className="space-y-6 flex-1">
                <form.Field
                  name="tableNumber"
                  validators={{
                    onBlur: ({ value }) => {
                      if (!value) return "Le numéro de table est requis.";
                      const n = parseInt(value);
                      if (isNaN(n) || n <= 0) return "Le numéro doit être supérieur à 0.";
                      if (existingNumbers.includes(n)) return `La table n°${n} existe déjà.`;
                      return undefined;
                    },
                    onSubmit: ({ value }) => {
                      if (!value) return "Le numéro de table est requis.";
                      const n = parseInt(value);
                      if (isNaN(n) || n <= 0) return "Le numéro doit être supérieur à 0.";
                      if (existingNumbers.includes(n)) return `La table n°${n} existe déjà.`;
                      return undefined;
                    },
                  }}
                >
                  {(field) => (
                    <div className="space-y-2">
                      <Label
                        htmlFor="tableNumber"
                        className="text-sm font-medium flex items-center gap-2"
                      >
                        <Hash className="h-4 w-4 text-primary" />
                        Numéro de la table
                      </Label>
                      <Input
                        id="tableNumber"
                        type="number"
                        placeholder="Ex: 1, 10, 42..."
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className={`h-11 transition-all focus:ring-2 ${
                          field.state.meta.errors.length > 0
                            ? "border-destructive focus:ring-destructive/20"
                            : "focus:ring-primary/20"
                        }`}
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

                <form.Field
                  name="capacity"
                  validators={{
                    onBlur: ({ value }) => {
                      if (!value) return "La capacité est requise.";
                      const n = parseInt(value);
                      if (isNaN(n) || n <= 0) return "La capacité doit être supérieure à 0.";
                      return undefined;
                    },
                    onSubmit: ({ value }) => {
                      if (!value) return "La capacité est requise.";
                      const n = parseInt(value);
                      if (isNaN(n) || n <= 0) return "La capacité doit être supérieure à 0.";
                      return undefined;
                    },
                  }}
                >
                  {(field) => (
                    <div className="space-y-2">
                      <Label
                        htmlFor="capacity"
                        className="text-sm font-medium flex items-center gap-2"
                      >
                        <Users className="h-4 w-4 text-primary" />
                        Capacité (personnes)
                      </Label>
                      <Input
                        id="capacity"
                        type="number"
                        placeholder="Ex: 2, 4, 8..."
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="h-11 transition-all focus:ring-2 focus:ring-primary/20"
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
                  form="create-table-form"
                  className="flex-1 h-11 font-semibold"
                  disabled={loading}
                >
                  {loading ? "Ajout..." : "Créer la table"}
                </Button>
              </DrawerFooter>
            </form>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};
