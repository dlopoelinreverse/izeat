"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DeleteMenuItemDocument,
  GetMenuCategoriesDocument,
} from "@/graphql/__generated__/graphql";
import { useMutation } from "@apollo/client/react";

interface DeleteItemButtonProps {
  itemId: string;
  menuId: string;
  itemName?: string;
  setOpen: (open: boolean) => void;
}

export const DeleteItemButton = ({
  itemId,
  menuId,
  itemName,
  setOpen,
}: DeleteItemButtonProps) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [deleteMenuItem, { loading }] = useMutation(DeleteMenuItemDocument, {
    onCompleted: () => {
      setConfirmOpen(false);
      setOpen(false);
    },
    update(cache, { data }) {
      if (!data?.deleteMenuItem) return;

      const existing = cache.readQuery({
        query: GetMenuCategoriesDocument,
        variables: { menuId },
      });

      if (!existing?.getMenuCategories) return;

      const newCategories = existing.getMenuCategories.map((category) => ({
        ...category,
        items: category.items?.filter(
          (item) => item.id !== data.deleteMenuItem.id,
        ),
      }));

      cache.writeQuery({
        query: GetMenuCategoriesDocument,
        variables: { menuId },
        data: { getMenuCategories: newCategories },
      });
    },
  });

  return (
    <>
      <Button
        variant="ghost"
        type="button"
        className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
        disabled={loading}
        onClick={() => setConfirmOpen(true)}
      >
        Supprimer le plat
      </Button>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce plat ?</AlertDialogTitle>
            <AlertDialogDescription>
              {itemName ? (
                <>
                  <strong>{itemName}</strong> sera définitivement supprimé du
                  menu. Cette action est irréversible.
                </>
              ) : (
                "Ce plat sera définitivement supprimé du menu. Cette action est irréversible."
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={loading}
              onClick={() =>
                deleteMenuItem({ variables: { deleteMenuItemId: itemId } })
              }
            >
              {loading ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
