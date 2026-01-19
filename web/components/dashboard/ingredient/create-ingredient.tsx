"use client";

import { useState } from "react";
import { CommandItem } from "@/components/ui/command";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IngredientCategory } from "./ingredient-category";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import {
  CreateIngredientDocument,
  GetRestaurantIngredientsDocument,
} from "@/graphql/__generated__/graphql";
import { useMutation } from "@apollo/client/react";
import { toast } from "sonner";
import { IngredientType } from "./ingredients-list";

interface CreateIngredientProps {
  query: string;
  restaurantId: string;
  onCreated?: (ingredient: IngredientType) => void;
}

export const CreateIngredient = ({
  query,
  restaurantId,
  onCreated,
}: CreateIngredientProps) => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createIngredientName, setCreateIngredientName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );

  const [createIngredient, { loading }] = useMutation(
    CreateIngredientDocument,
    {
      onCompleted: (data) => {
        setCreateDialogOpen(false);
        if (onCreated && data.createIngredient) {
          onCreated(data.createIngredient);
        }
      },
      update: (cache, { data }) => {
        const existingData = cache.readQuery({
          query: GetRestaurantIngredientsDocument,
          variables: {
            restaurantId,
          },
        });
        if (existingData && data && existingData.getRestaurantIngredients) {
          cache.writeQuery({
            query: GetRestaurantIngredientsDocument,
            variables: {
              restaurantId,
            },
            data: {
              getRestaurantIngredients: [
                ...existingData.getRestaurantIngredients,
                {
                  ...data.createIngredient,
                  __typename: "Ingredient",
                  ingredientCategory: {
                    ...data.createIngredient.ingredientCategory,
                    __typename: "IngredientCategory",
                  },
                },
              ],
            },
          });
        }
      },
      // awaitRefetchQueries: true,
    },
  );

  const handleSubmit = () => {
    if (!createIngredientName || !selectedCategoryId) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    createIngredient({
      variables: {
        ingredient: {
          name: createIngredientName,
          restaurantId,
          ingredientCategoryId: selectedCategoryId,
        },
      },
    });
    setCreateDialogOpen(false);
  };

  return (
    <>
      <CommandItem
        value={`create-${query}`}
        className="cursor-pointer "
        onSelect={() => {
          setCreateIngredientName(query);
          setCreateDialogOpen(true);
        }}
      >
        <Plus className=" h-4 w-4 mr-2" />
        <span>Créer l’ingrédient </span>
        <strong className="ml-1">{query}</strong>
      </CommandItem>
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ajouter un ingrédient</DialogTitle>
            <DialogDescription>
              Remplissez les détails pour créer un nouvel ingrédient.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                value={createIngredientName}
                onChange={(e) => setCreateIngredientName(e.target.value)}
                placeholder="Ex: Tomates"
              />
            </div>
            <div className="grid gap-2">
              <Label>Catégorie</Label>
              <IngredientCategory
                restaurantId={restaurantId}
                onCategorySelect={setSelectedCategoryId}
                selectedCategoryId={selectedCategoryId}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreateDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!createIngredientName || !selectedCategoryId}
            >
              Créer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
