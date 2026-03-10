"use client";

import {
  CreateTableDocument,
  GetRestaurantTablesDocument,
  GetRestaurantTablesQuery,
} from "@/graphql/__generated__/graphql";
import { useMutation } from "@apollo/client/react";
import { Hash, Users } from "lucide-react";
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

interface CreateTableProps {
  restaurantId: string;
  existingNumbers: number[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateTable = ({
  restaurantId,
  existingNumbers,
  open,
  onOpenChange,
}: CreateTableProps) => {
  const { refetchOnboarding } = useOnboarding();

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
      onOpenChange(false);
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>Nouvelle table</DialogTitle>
          <DialogDescription>
            Configurez une nouvelle table pour votre restaurant.
          </DialogDescription>
        </DialogHeader>
        <form
          id="create-table-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex flex-col gap-4 pt-2"
        >
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

          <DialogFooter className="gap-2 pt-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button type="submit" form="create-table-form" disabled={loading}>
              {loading ? "Ajout..." : "Créer la table"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
