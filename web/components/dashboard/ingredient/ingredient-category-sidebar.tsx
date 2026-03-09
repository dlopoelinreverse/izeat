"use client";

import { useRef, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
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
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<{ id: string; name: string } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
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

  const handleUpdate = (id: string) => {
    if (!editName.trim()) return;
    updateCategory({ variables: { id, name: editName.trim() } });
  };

  const handleDelete = (id: string) => {
    deleteCategory({ variables: { id } });
  };

  const categories = data?.getRestaurantIngredientCategories ?? [];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-3 border-b shrink-0">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Catégories
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setCreateOpen(true)}
          title="Nouvelle catégorie"
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Liste */}
      <div className="flex-1 overflow-y-auto py-2 px-2 flex flex-col gap-0.5">
        {loading ? (
          <p className="text-xs text-muted-foreground px-2 py-2">Chargement...</p>
        ) : (
          categories.map((category) => (
            <div
              key={category.id}
              className={cn(
                "group flex items-center gap-1 rounded-lg px-2 py-2 cursor-pointer transition-colors",
                selectedCategoryId === category.id
                  ? "bg-accent border border-border"
                  : "hover:bg-secondary border border-transparent"
              )}
            >
              <button
                className="flex-1 text-left text-sm truncate font-medium"
                style={{
                  color:
                    selectedCategoryId === category.id
                      ? "var(--foreground)"
                      : "var(--muted-foreground)",
                }}
                onClick={() => onSelect(category.id)}
              >
                {category.name}
              </button>
              <div className="flex gap-0.5 shrink-0 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditTarget({ id: category.id, name: category.name });
                    setEditName(category.name);
                  }}
                >
                  <Pencil className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 hover:text-destructive hover:bg-destructive/10"
                  disabled={deleting}
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteTarget({ id: category.id, name: category.name });
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))
        )}

        {!loading && categories.length === 0 && (
          <p className="text-xs text-muted-foreground px-2 py-4 text-center">
            Aucune catégorie
          </p>
        )}
      </div>

      {/* Dialog — Créer une catégorie */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-[380px]">
          <DialogHeader>
            <DialogTitle>Nouvelle catégorie</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 pt-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="cat-name">Nom de la catégorie</Label>
              <Input
                id="cat-name"
                autoFocus
                placeholder="Ex: Viandes, Poissons, Épices…"
                onChange={(e) => (newNameRef.current = e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCreate();
                    setCreateOpen(false);
                  }
                  if (e.key === "Escape") setCreateOpen(false);
                }}
              />
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setCreateOpen(false)}>
                Annuler
              </Button>
              <Button
                disabled={creating}
                onClick={() => {
                  handleCreate();
                  setCreateOpen(false);
                }}
              >
                {creating ? "Création..." : "Créer"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog — Renommer une catégorie */}
      <Dialog
        open={!!editTarget}
        onOpenChange={(open) => {
          if (!open) setEditTarget(null);
        }}
      >
        <DialogContent className="sm:max-w-[380px]">
          <DialogHeader>
            <DialogTitle>Renommer la catégorie</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 pt-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="cat-edit-name">Nom de la catégorie</Label>
              <Input
                id="cat-edit-name"
                autoFocus
                defaultValue={editTarget?.name}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && editTarget) {
                    handleUpdate(editTarget.id);
                    setEditTarget(null);
                  }
                  if (e.key === "Escape") setEditTarget(null);
                }}
              />
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setEditTarget(null)}>
                Annuler
              </Button>
              <Button
                disabled={updating || !editName.trim()}
                onClick={() => {
                  if (editTarget) {
                    handleUpdate(editTarget.id);
                    setEditTarget(null);
                  }
                }}
              >
                {updating ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog — Confirmer la suppression d'une catégorie */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <DialogContent className="sm:max-w-[380px]">
          <DialogHeader>
            <DialogTitle>Supprimer la catégorie</DialogTitle>
            <DialogDescription>
              Voulez-vous supprimer <span className="font-semibold text-foreground">«&nbsp;{deleteTarget?.name}&nbsp;»</span> ? Tous ses ingrédients seront également supprimés. Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 pt-2">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              disabled={deleting}
              onClick={() => {
                if (deleteTarget) {
                  handleDelete(deleteTarget.id);
                  setDeleteTarget(null);
                }
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
