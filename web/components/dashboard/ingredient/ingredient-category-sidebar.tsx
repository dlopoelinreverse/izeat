"use client";

import { useRef, useState } from "react";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  CreateIngredientCategoryDocument,
  UpdateIngredientCategoryDocument,
  DeleteIngredientCategoryDocument,
  GetRestaurantIngredientCategoriesDocument,
} from "@/graphql/__generated__/graphql";
import { useMutation, useQuery } from "@apollo/client/react";
import { toast } from "sonner";

interface IngredientCategorySidebarProps {
  restaurantId: string;
  selectedCategoryId: string | null;
  onSelect: (id: string | null) => void;
}

export const IngredientCategorySidebar = ({
  restaurantId,
  selectedCategoryId,
  onSelect,
}: IngredientCategorySidebarProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const newNameRef = useRef("");

  const { data, loading } = useQuery(GetRestaurantIngredientCategoriesDocument, {
    variables: { restaurantId },
  });

  const [createCategory, { loading: creating }] = useMutation(
    CreateIngredientCategoryDocument,
    {
      onCompleted: (data) => {
        toast.success("Catégorie créée");
        setIsCreating(false);
        newNameRef.current = "";
        if (data.createIngredientCategory) {
          onSelect(data.createIngredientCategory.id);
        }
      },
      update(cache, { data }) {
        if (!data?.createIngredientCategory) return;
        const existing = cache.readQuery({
          query: GetRestaurantIngredientCategoriesDocument,
          variables: { restaurantId },
        });
        if (!existing?.getRestaurantIngredientCategories) return;
        cache.writeQuery({
          query: GetRestaurantIngredientCategoriesDocument,
          variables: { restaurantId },
          data: {
            getRestaurantIngredientCategories: [
              ...existing.getRestaurantIngredientCategories,
              data.createIngredientCategory,
            ],
          },
        });
      },
    }
  );

  const [updateCategory, { loading: updating }] = useMutation(
    UpdateIngredientCategoryDocument,
    {
      onCompleted: () => {
        toast.success("Catégorie renommée");
        setEditingId(null);
      },
      update(cache, { data }) {
        if (!data?.updateIngredientCategory) return;
        const existing = cache.readQuery({
          query: GetRestaurantIngredientCategoriesDocument,
          variables: { restaurantId },
        });
        if (!existing?.getRestaurantIngredientCategories) return;
        cache.writeQuery({
          query: GetRestaurantIngredientCategoriesDocument,
          variables: { restaurantId },
          data: {
            getRestaurantIngredientCategories:
              existing.getRestaurantIngredientCategories.map((c) =>
                c.id === data.updateIngredientCategory.id
                  ? { ...c, name: data.updateIngredientCategory.name }
                  : c
              ),
          },
        });
      },
    }
  );

  const [deleteCategory, { loading: deleting }] = useMutation(
    DeleteIngredientCategoryDocument,
    {
      update(cache, _result, { variables }) {
        const id = variables?.id;
        if (!id) return;
        const existing = cache.readQuery({
          query: GetRestaurantIngredientCategoriesDocument,
          variables: { restaurantId },
        });
        if (!existing?.getRestaurantIngredientCategories) return;
        cache.writeQuery({
          query: GetRestaurantIngredientCategoriesDocument,
          variables: { restaurantId },
          data: {
            getRestaurantIngredientCategories:
              existing.getRestaurantIngredientCategories.filter(
                (c) => c.id !== id
              ),
          },
        });
        if (selectedCategoryId === id) {
          onSelect(null);
        }
      },
    }
  );

  const handleCreate = () => {
    const name = newNameRef.current.trim();
    if (!name) return;
    createCategory({ variables: { name, restaurantId } });
  };

  const handleStartEdit = (id: string, currentName: string) => {
    setEditingId(id);
    setEditName(currentName);
  };

  const handleUpdate = (id: string) => {
    if (!editName.trim()) return;
    updateCategory({ variables: { id, name: editName.trim() } });
  };

  const handleDelete = (id: string, name: string) => {
    if (
      confirm(
        `Supprimer la catégorie "${name}" ? Tous ses ingrédients seront également supprimés.`
      )
    ) {
      deleteCategory({ variables: { id } });
    }
  };

  const categories = data?.getRestaurantIngredientCategories ?? [];

  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 px-1">
        Catégories
      </p>

      {loading ? (
        <div className="text-sm text-muted-foreground px-2 py-2">Chargement...</div>
      ) : (
        categories.map((category) => (
          <div
            key={category.id}
            className={cn(
              "flex items-center gap-1 rounded-md px-2 py-1.5",
              selectedCategoryId === category.id
                ? "bg-accent text-accent-foreground"
                : "hover:bg-muted/60"
            )}
          >
            {editingId === category.id ? (
              <div className="flex flex-1 gap-1 items-center animate-in fade-in zoom-in duration-200">
                <Input
                  autoFocus
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="h-6 text-sm px-1.5"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleUpdate(category.id);
                    if (e.key === "Escape") setEditingId(null);
                  }}
                />
                <Button
                  size="icon"
                  className="h-6 w-6 shrink-0"
                  disabled={updating || !editName.trim()}
                  onClick={() => handleUpdate(category.id)}
                >
                  <Check className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0"
                  onClick={() => setEditingId(null)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <>
                <button
                  className="flex-1 text-left text-sm truncate cursor-pointer"
                  onClick={() => onSelect(category.id)}
                >
                  {category.name}
                </button>
                <div className="flex gap-0.5 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartEdit(category.id, category.name);
                    }}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-destructive hover:text-destructive"
                    disabled={deleting}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(category.id, category.name);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </>
            )}
          </div>
        ))
      )}

      {isCreating ? (
        <div className="flex gap-1 items-center mt-1 animate-in fade-in zoom-in duration-200">
          <Input
            autoFocus
            placeholder="Nom de la catégorie"
            className="h-7 text-sm"
            onChange={(e) => (newNameRef.current = e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreate();
              if (e.key === "Escape") setIsCreating(false);
            }}
          />
          <Button
            size="icon"
            className="h-7 w-7 shrink-0"
            disabled={creating}
            onClick={handleCreate}
          >
            <Check className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0"
            onClick={() => setIsCreating(false)}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          className="mt-1 justify-start text-muted-foreground hover:text-foreground"
          onClick={() => setIsCreating(true)}
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          Nouvelle catégorie
        </Button>
      )}
    </div>
  );
};
