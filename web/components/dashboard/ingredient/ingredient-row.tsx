"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, X, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  ToggleIngredientAvailableDocument,
  UpdateIngredientDocument,
  DeleteIngredientDocument,
  GetRestaurantIngredientsDocument,
} from "@/graphql/__generated__/graphql";
import { useMutation } from "@apollo/client/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
  const [deleteOpen, setDeleteOpen] = useState(false);

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
    deleteIngredient({ variables: { id: ingredient.id } });
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 px-4 py-2">
        <Input
          autoFocus
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          className="h-8 text-sm flex-1"
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
          className="h-8 w-8 shrink-0"
          disabled={updating || !editName.trim()}
          onClick={handleUpdate}
        >
          <Check className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={() => {
            setIsEditing(false);
            setEditName(ingredient.name);
          }}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    );
  }

  return (
    <div className="group flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-secondary transition-colors">
      {/* Badge disponibilité cliquable */}
      <button
        onClick={handleToggle}
        disabled={toggling}
        title={ingredient.available ? "Cliquer pour mettre en rupture" : "Cliquer pour remettre disponible"}
        className={cn(
          "shrink-0 text-xs font-semibold px-2.5 py-0.5 rounded-full border cursor-pointer transition-colors",
          ingredient.available
            ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
            : "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100"
        )}
      >
        {ingredient.available ? "● Dispo" : "○ Rupture"}
      </button>

      {/* Nom */}
      <span className={cn(
        "flex-1 text-sm",
        !ingredient.available && "text-muted-foreground line-through"
      )}>
        {ingredient.name}
      </span>

      {/* Actions — visibles au hover uniquement */}
      <div className="flex gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity shrink-0">
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
          className="h-7 w-7 hover:text-destructive hover:bg-destructive/10"
          disabled={deleting}
          onClick={() => setDeleteOpen(true)}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Modal de confirmation de suppression */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-[380px]">
          <DialogHeader>
            <DialogTitle>Supprimer l&apos;ingrédient</DialogTitle>
            <DialogDescription>
              Voulez-vous supprimer <span className="font-semibold text-foreground">«&nbsp;{ingredient.name}&nbsp;»</span> ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 pt-2">
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              disabled={deleting}
              onClick={() => {
                handleDelete();
                setDeleteOpen(false);
              }}
            >
              {deleting ? "Suppression..." : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
