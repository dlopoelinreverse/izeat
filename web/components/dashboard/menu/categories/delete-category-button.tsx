"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
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
import { useMutation } from "@apollo/client/react";
import { DeleteMenuCategoryDocument } from "@/graphql/__generated__/graphql";

interface DeleteCategoryButtonProps {
  categoryId: string;
  categoryName?: string;
  disabled?: boolean;
}

export const DeleteCategoryButton = ({
  categoryId,
  categoryName,
  disabled,
}: DeleteCategoryButtonProps) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [deleteMenuCategory, { loading }] = useMutation(
    DeleteMenuCategoryDocument,
    {
      refetchQueries: ["GetMenuCategories"],
    }
  );

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
        disabled={disabled || loading}
        onClick={(e) => {
          e.stopPropagation();
          setConfirmOpen(true);
        }}
        title="Supprimer la catégorie"
      >
        <Trash2 className="size-3.5" />
      </Button>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette catégorie ?</AlertDialogTitle>
            <AlertDialogDescription>
              {categoryName ? (
                <>
                  La catégorie <strong>{categoryName}</strong> et tous ses plats
                  seront définitivement supprimés. Cette action est irréversible.
                </>
              ) : (
                "Cette catégorie et tous ses plats seront définitivement supprimés. Cette action est irréversible."
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={loading}
              onClick={() =>
                deleteMenuCategory({ variables: { categoryId } })
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
