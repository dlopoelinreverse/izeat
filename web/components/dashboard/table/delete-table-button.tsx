"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client/react";
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
  DeleteTableDocument,
  GetRestaurantTablesDocument,
  GetRestaurantTablesQuery,
} from "@/graphql/__generated__/graphql";
import { toast } from "sonner";
import { useOnboarding } from "@/contexts/onboarding-context";

interface DeleteTableButtonProps {
  tableId: string;
  tableNumber: number;
  restaurantId: string;
}

export const DeleteTableButton = ({
  tableId,
  tableNumber,
  restaurantId,
}: DeleteTableButtonProps) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { refetchOnboarding } = useOnboarding();

  const [deleteTable, { loading }] = useMutation(DeleteTableDocument, {
    variables: { id: tableId },
    onCompleted: () => {
      toast.success("Table supprimée avec succès");
      refetchOnboarding();
    },
    onError: (error) => {
      console.error(error);
      toast.error(error.message || "Erreur lors de la suppression de la table");
    },
    update: (cache) => {
      const existingTables = cache.readQuery<GetRestaurantTablesQuery>({
        query: GetRestaurantTablesDocument,
        variables: { restaurantId },
      });

      if (existingTables) {
        cache.writeQuery<GetRestaurantTablesQuery>({
          query: GetRestaurantTablesDocument,
          variables: { restaurantId },
          data: {
            getRestaurantTables: existingTables.getRestaurantTables.filter(
              (t) => t.id !== tableId,
            ),
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
        title="Supprimer la table"
      >
        <Trash2 className="size-3.5" />
      </Button>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette table ?</AlertDialogTitle>
            <AlertDialogDescription>
              La table n°{tableNumber} sera définitivement supprimée. Cette
              action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={loading}
              onClick={() => deleteTable()}
            >
              {loading ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
