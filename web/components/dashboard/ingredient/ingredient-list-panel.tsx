"use client";

import { useState } from "react";
import { Plus, Carrot, Search } from "lucide-react";
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
  const [search, setSearch] = useState("");

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

  const unavailableCount = filteredIngredients?.filter((i) => !i.available).length ?? 0;

  const displayedIngredients = filteredIngredients?.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  const available = displayedIngredients?.filter((i) => i.available) ?? [];
  const unavailable = displayedIngredients?.filter((i) => !i.available) ?? [];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b bg-card shrink-0">
        <div>
          <h2 className="text-base font-bold text-foreground">
            {selectedCategory?.name ?? "Catégorie"}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {filteredIngredients?.length ?? 0} ingrédient{(filteredIngredients?.length ?? 0) > 1 ? "s" : ""}
            {unavailableCount > 0 && (
              <span className="text-amber-600"> · {unavailableCount} en rupture</span>
            )}
          </p>
        </div>
        <Button size="sm" onClick={handleOpenAdd}>
          <Plus className="h-4 w-4 mr-1" />
          Ajouter
        </Button>
      </div>

      {/* Barre de recherche — visible si plus de 4 ingrédients */}
      {(filteredIngredients?.length ?? 0) > 4 && (
        <div className="px-5 py-2.5 border-b shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Rechercher un ingrédient…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8 text-sm"
            />
          </div>
        </div>
      )}

      {/* Liste */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="text-sm text-muted-foreground px-5 py-4">Chargement...</div>
        ) : filteredIngredients && filteredIngredients.length > 0 ? (
          <div className="flex flex-col py-1">
            {/* Disponibles */}
            {available.map((ingredient) => (
              <IngredientRow
                key={ingredient.id}
                ingredient={ingredient}
                restaurantId={restaurantId}
              />
            ))}

            {/* Séparateur rupture */}
            {unavailable.length > 0 && (
              <>
                <div className="flex items-center gap-3 px-5 py-2">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">
                    En rupture · {unavailable.length}
                  </span>
                  <div className="flex-1 h-px bg-border" />
                </div>
                {unavailable.map((ingredient) => (
                  <IngredientRow
                    key={ingredient.id}
                    ingredient={ingredient}
                    restaurantId={restaurantId}
                  />
                ))}
              </>
            )}
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
      </div>

      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Ajouter dans « {selectedCategory?.name} »</DialogTitle>
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
