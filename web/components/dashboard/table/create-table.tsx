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

interface CreateTableProps {
  restaurantId: string;
  existingNumbers: number[];
}

export const CreateTable = ({ restaurantId, existingNumbers }: CreateTableProps) => {
  const { refetchOnboarding } = useOnboarding();
  const [open, setOpen] = useState(false);
  const [tableNumber, setTableNumber] = useState("");
  const [capacity, setCapacity] = useState("");

  const isDuplicate =
    tableNumber !== "" && existingNumbers.includes(parseInt(tableNumber));

  const [createTable, { loading }] = useMutation(CreateTableDocument, {
    onCompleted: () => {
      toast.success("Table ajoutée avec succès");
      setOpen(false);
      setTableNumber("");
      setCapacity("");
      refetchOnboarding();
    },
    onError: (error) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tableNumber || !capacity) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    if (isDuplicate) {
      toast.error(`La table n°${tableNumber} existe déjà`);
      return;
    }

    createTable({
      variables: {
        tableInput: {
          restaurantId,
          number: parseInt(tableNumber),
          capacity: parseInt(capacity),
        },
      },
    });
  };

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
        <DrawerContent className="max-h-[96vh]">
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

            <form onSubmit={handleSubmit} className="flex flex-col flex-1 p-6">
              <div className="space-y-6 flex-1">
                <div className="space-y-2">
                  <Label
                    htmlFor="number"
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    <Hash className="h-4 w-4 text-primary" />
                    Numéro de la table
                  </Label>
                  <Input
                    id="number"
                    type="number"
                    placeholder="Ex: 1, 10, 42..."
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className={`h-11 transition-all focus:ring-2 ${isDuplicate ? "border-destructive focus:ring-destructive/20" : "focus:ring-primary/20"}`}
                    autoFocus
                  />
                  {isDuplicate && (
                    <p className="text-xs text-destructive">
                      La table n°{tableNumber} existe déjà
                    </p>
                  )}
                </div>

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
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className="h-11 transition-all focus:ring-2 focus:ring-primary/20"
                  />
                </div>
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
                  className="flex-1 h-11 font-semibold"
                  disabled={loading || isDuplicate}
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
