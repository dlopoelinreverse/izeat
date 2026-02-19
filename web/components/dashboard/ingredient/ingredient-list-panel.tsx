"use client";

import { useState } from "react";
import { Plus, Carrot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  CreateIngredientDocument,
  GetRestaurantIngredientsDocument,
} from "@/graphql/__generated__/graphql";
import { useMutation, useQuery } from "@apollo/client/react";
import { toast } from "sonner";
import { IngredientRow } from "./ingredient-row";
import { EmptyState } from "@/components/dashboard/empty-state";

interface IngredientListPanelProps {
  restaurantId: string;
  selectedCategoryId: string;
  categories: Array<{ id: string; name: string }>;
}

export const IngredientListPanel = ({
  restaurantId,
  selectedCategoryId,
  categories,
}: IngredientListPanelProps) => {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");

  const { data, loading } = useQuery(GetRestaurantIngredientsDocument, {
    variables: { restaurantId },
  });

  const [createIngredient, { loading: creating }] = useMutation(
    CreateIngredientDocument,
    {
      onCompleted: () => {
        setAddDialogOpen(false);
        setNewName("");
        toast.success("Ingrédient ajouté");
      },
      update(cache, { data }) {
        if (!data?.createIngredient) return;
        const existing = cache.readQuery({
          query: GetRestaurantIngredientsDocument,
          variables: { restaurantId },
        });
        if (!existing?.getRestaurantIngredients) return;
        cache.writeQuery({
          query: GetRestaurantIngredientsDocument,
          variables: { restaurantId },
          data: {
            getRestaurantIngredients: [
              ...existing.getRestaurantIngredients,
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
      },
    }
  );

  const handleOpenAdd = () => {
    setNewName("");
    setAddDialogOpen(true);
  };

  const handleAdd = () => {
    if (!newName.trim()) return;
    createIngredient({
      variables: {
        ingredient: {
          name: newName.trim(),
          restaurantId,
          ingredientCategoryId: selectedCategoryId,
        },
      },
    });
  };

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);
  const filteredIngredients = data?.getRestaurantIngredients?.filter(
    (i) => i.ingredientCategory.id === selectedCategoryId
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">
          {selectedCategory?.name ?? "Catégorie"}
        </h2>
        <Button size="sm" onClick={handleOpenAdd}>
          <Plus className="h-4 w-4 mr-1" />
          Ajouter un ingrédient
        </Button>
      </div>

      {loading ? (
        <div className="text-sm text-muted-foreground px-3 py-4">Chargement...</div>
      ) : filteredIngredients && filteredIngredients.length > 0 ? (
        <div className="flex flex-col">
          {filteredIngredients.map((ingredient) => (
            <IngredientRow
              key={ingredient.id}
              ingredient={ingredient}
              restaurantId={restaurantId}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Carrot}
          title="Aucun ingrédient"
          description="Cette catégorie ne contient pas encore d'ingrédients. Ajoutez-en un pour commencer."
          action={
            <Button onClick={handleOpenAdd}>
              <Plus className="h-4 w-4 mr-1" />
              Ajouter un ingrédient
            </Button>
          }
        />
      )}

      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Ajouter un ingrédient</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="ing-name">Nom</Label>
              <Input
                id="ing-name"
                autoFocus
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Ex: Tomates"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAdd();
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleAdd}
              disabled={creating || !newName.trim()}
            >
              {creating ? "Ajout..." : "Ajouter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
