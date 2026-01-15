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

interface CreateIngredientProps {
  query: string;
}

export const CreateIngredient = ({ query }: CreateIngredientProps) => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createIngredientName, setCreateIngredientName] = useState("");
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
        <Plus className=" h-4 w-4" />
        <span>Créer l’ingrédient </span>
        <strong>{query}</strong>
      </CommandItem>
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un ingrédient</DialogTitle>
            <DialogDescription>
              Créer l’ingrédient {createIngredientName}
            </DialogDescription>
          </DialogHeader>
          <IngredientCategory restaurantId={query} />
        </DialogContent>
      </Dialog>
    </>
  );
};
