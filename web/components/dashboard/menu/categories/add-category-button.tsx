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
import { useQueryState } from "nuqs";
import { useState } from "react";

interface AddCategoryButtonProps {
  menuId: string;
  disabled?: boolean;
}

export const AddCategoryButton = ({
  menuId,
  disabled,
}: AddCategoryButtonProps) => {
  const [open, setOpen] = useState(false);
  const [, setCategoryId] = useQueryState("categoryId");
  const [createMenuCategory] = useMutation(CreateMenuCategoryDocument, {
    onCompleted: (data) => {
      setOpen(false);
      setCategoryId(data.createMenuCategory.id);
    },
    refetchQueries: ["GetMenuCategories"],
    awaitRefetchQueries: true,
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
        <Button disabled={disabled}>Ajouter une catégorie</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter une catégorie</DialogTitle>
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
