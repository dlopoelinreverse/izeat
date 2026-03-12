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
  DeleteDishDocument,
  GetMenuCategoriesDocument,
} from "@/graphql/__generated__/graphql";
import { useMutation } from "@apollo/client/react";
import { toast } from "sonner";

interface DeleteItemButtonProps {
  itemId: string;
  menuId: string;
  dishId?: string;
  itemName?: string;
  setOpen: (open: boolean) => void;
}

export const DeleteItemButton = ({
  itemId,
  menuId,
  dishId,
  itemName,
  setOpen,
}: DeleteItemButtonProps) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteMode, setDeleteMode] = useState<"unlink" | "permanent">("unlink");

  const [deleteMenuItem, { loading: unlinkLoading }] = useMutation(
    DeleteMenuItemDocument,
    {
      onCompleted: () => {
        toast.success("Plat retiré du menu");
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
    },
  );

  const [deleteDish, { loading: deleteLoading }] = useMutation(
    DeleteDishDocument,
    {
      onCompleted: () => {
        toast.success("Plat supprimé définitivement");
        setConfirmOpen(false);
        setOpen(false);
      },
      onError: (error) => {
        toast.error(error.message || "Erreur lors de la suppression");
      },
      refetchQueries: [
        { query: GetMenuCategoriesDocument, variables: { menuId } },
      ],
    },
  );

  const loading = unlinkLoading || deleteLoading;

  const handleConfirm = () => {
    if (deleteMode === "unlink") {
      deleteMenuItem({ variables: { deleteMenuItemId: itemId } });
    } else if (dishId) {
      deleteDish({ variables: { id: dishId } });
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        type="button"
        className="w-full text-muted-foreground hover:text-foreground"
        disabled={loading}
        onClick={() => {
          setDeleteMode("unlink");
          setConfirmOpen(true);
        }}
      >
        Retirer du menu
      </Button>

      {dishId && (
        <Button
          variant="ghost"
          type="button"
          className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
          disabled={loading}
          onClick={() => {
            setDeleteMode("permanent");
            setConfirmOpen(true);
          }}
        >
          Supprimer définitivement
        </Button>
      )}

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {deleteMode === "unlink"
                ? "Retirer ce plat du menu ?"
                : "Supprimer ce plat définitivement ?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deleteMode === "unlink" ? (
                itemName ? (
                  <>
                    <strong>{itemName}</strong> sera retiré de cette catégorie.
                    Le plat restera disponible pour être lié à d&apos;autres
                    catégories.
                  </>
                ) : (
                  "Ce plat sera retiré de cette catégorie. Il restera disponible pour être lié à d'autres catégories."
                )
              ) : itemName ? (
                <>
                  <strong>{itemName}</strong> sera définitivement supprimé ainsi
                  que tous ses liens dans les menus. Cette action est
                  irréversible.
                </>
              ) : (
                "Ce plat sera définitivement supprimé ainsi que tous ses liens dans les menus. Cette action est irréversible."
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className={
                deleteMode === "permanent"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : ""
              }
              disabled={loading}
              onClick={handleConfirm}
            >
              {loading
                ? "Suppression..."
                : deleteMode === "unlink"
                  ? "Retirer"
                  : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
