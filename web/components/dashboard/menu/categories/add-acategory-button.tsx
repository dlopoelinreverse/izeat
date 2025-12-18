"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CreateMenuCategoryDocument } from "@/graphql/__generated__/graphql";
import { useMutation } from "@apollo/client/react";
import { useState } from "react";

export const AddACategoryButton = ({
  menuId,
  onAdd,
}: {
  menuId: string;
  onAdd: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const [createMenuCategory] = useMutation(CreateMenuCategoryDocument, {
    onCompleted: () => {
      setOpen(false);
      onAdd();
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    if (!name) {
      return;
    }
    createMenuCategory({
      variables: {
        name,
        menuId,
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Ajouter une categorie</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter une categorie</DialogTitle>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Input placeholder="Nom de la categorie" name="name" />
          <Button type="submit">Ajouter</Button>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Annuler</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
