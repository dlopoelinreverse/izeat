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
import {
  DeleteMenuDocument,
  GetMenusDocument,
  GetMenusQuery,
} from "@/graphql/__generated__/graphql";
import { useMutation } from "@apollo/client/react";
import { toast } from "sonner";
import { useOnboarding } from "@/contexts/onboarding-context";

interface DeleteMenuButtonProps {
  menuId: string;
  menuName?: string;
  restaurantId: string;
}

export const DeleteMenuButton = ({
  menuId,
  menuName,
  restaurantId,
}: DeleteMenuButtonProps) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { refetchOnboarding } = useOnboarding();

  const [deleteMenu, { loading }] = useMutation(DeleteMenuDocument, {
    variables: { deleteMenuId: menuId },
    onCompleted: () => {
      toast.success("Menu supprimé avec succès");
      refetchOnboarding();
    },
    onError: (error) => {
      console.error(error);
      toast.error(error.message || "Erreur lors de la suppression du menu");
    },
    update: (cache) => {
      const existingData = cache.readQuery<GetMenusQuery>({
        query: GetMenusDocument,
        variables: { restaurantId },
      });

      if (existingData) {
        cache.writeQuery({
          query: GetMenusDocument,
          variables: { restaurantId },
          data: {
            getMenus: existingData.getMenus.filter((m) => m.id !== menuId),
          },
        });
      }
    },
  });

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors h-7 w-7"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setConfirmOpen(true);
        }}
        disabled={loading}
        title="Supprimer le menu"
      >
        <Trash2 className="size-3.5" />
      </Button>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce menu ?</AlertDialogTitle>
            <AlertDialogDescription>
              {menuName ? (
                <>
                  Le menu <strong>{menuName}</strong> sera définitivement
                  supprimé avec toutes ses catégories et ses plats. Cette action
                  est irréversible.
                </>
              ) : (
                "Ce menu sera définitivement supprimé avec toutes ses catégories et ses plats. Cette action est irréversible."
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={loading}
              onClick={() => deleteMenu()}
            >
              {loading ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
