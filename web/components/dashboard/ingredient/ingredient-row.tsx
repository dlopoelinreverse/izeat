"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, XCircle, Pencil, Trash2, X, Check } from "lucide-react";
import {
  ToggleIngredientAvailableDocument,
  UpdateIngredientDocument,
  DeleteIngredientDocument,
  GetRestaurantIngredientsDocument,
} from "@/graphql/__generated__/graphql";
import { useMutation } from "@apollo/client/react";
import { toast } from "sonner";

interface IngredientRowProps {
  ingredient: {
    id: string;
    name: string;
    available: boolean;
    ingredientCategory: { id: string; name: string };
  };
  restaurantId: string;
}

export const IngredientRow = ({ ingredient, restaurantId }: IngredientRowProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(ingredient.name);

  const [toggleAvailable, { loading: toggling }] = useMutation(
    ToggleIngredientAvailableDocument,
    {
      update(cache, { data }) {
        if (data?.toggleIngredientAvailable === undefined) return;
        cache.modify({
          id: cache.identify({ __typename: "Ingredient", id: ingredient.id }),
          fields: {
            available: () => data.toggleIngredientAvailable,
          },
        });
      },
    }
  );

  const [updateIngredient, { loading: updating }] = useMutation(
    UpdateIngredientDocument,
    {
      onCompleted: () => {
        setIsEditing(false);
        toast.success("Ingrédient modifié");
      },
      update(cache, { data }) {
        if (!data?.updateIngredient) return;
        const existing = cache.readQuery({
          query: GetRestaurantIngredientsDocument,
          variables: { restaurantId },
        });
        if (!existing?.getRestaurantIngredients) return;
        cache.writeQuery({
          query: GetRestaurantIngredientsDocument,
          variables: { restaurantId },
          data: {
            getRestaurantIngredients: existing.getRestaurantIngredients.map((i) =>
              i.id === ingredient.id ? { ...i, ...data.updateIngredient } : i
            ),
          },
        });
      },
    }
  );

  const [deleteIngredient, { loading: deleting }] = useMutation(
    DeleteIngredientDocument,
    {
      update(cache) {
        const existing = cache.readQuery({
          query: GetRestaurantIngredientsDocument,
          variables: { restaurantId },
        });
        if (!existing?.getRestaurantIngredients) return;
        cache.writeQuery({
          query: GetRestaurantIngredientsDocument,
          variables: { restaurantId },
          data: {
            getRestaurantIngredients: existing.getRestaurantIngredients.filter(
              (i) => i.id !== ingredient.id
            ),
          },
        });
      },
    }
  );

  const handleToggle = () => {
    toggleAvailable({ variables: { id: ingredient.id } });
  };

  const handleUpdate = () => {
    if (!editName.trim()) return;
    updateIngredient({
      variables: {
        input: {
          id: ingredient.id,
          name: editName.trim(),
          ingredientCategoryId: ingredient.ingredientCategory.id,
        },
      },
    });
  };

  const handleDelete = () => {
    if (confirm(`Supprimer l'ingrédient "${ingredient.name}" ?`)) {
      deleteIngredient({ variables: { id: ingredient.id } });
    }
  };

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted/50">
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 shrink-0"
        disabled={toggling}
        onClick={handleToggle}
        title={ingredient.available ? "Disponible — cliquer pour désactiver" : "Indisponible — cliquer pour activer"}
      >
        {ingredient.available ? (
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        ) : (
          <XCircle className="h-4 w-4 text-muted-foreground" />
        )}
      </Button>

      {isEditing ? (
        <div className="flex flex-1 gap-2 items-center animate-in fade-in zoom-in duration-200">
          <Input
            autoFocus
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="h-7 text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleUpdate();
              if (e.key === "Escape") {
                setIsEditing(false);
                setEditName(ingredient.name);
              }
            }}
          />
          <Button
            size="icon"
            className="h-7 w-7"
            disabled={updating || !editName.trim()}
            onClick={handleUpdate}
          >
            <Check className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => {
              setIsEditing(false);
              setEditName(ingredient.name);
            }}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      ) : (
        <>
          <span className={`flex-1 text-sm ${!ingredient.available ? "text-muted-foreground line-through" : ""}`}>
            {ingredient.name}
          </span>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive hover:text-destructive"
              disabled={deleting}
              onClick={handleDelete}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
