"use client";

import { useMutation } from "@apollo/client/react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DeleteTableDocument,
  GetRestaurantTablesDocument,
  GetRestaurantTablesQuery,
} from "@/graphql/__generated__/graphql";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface DeleteTableButtonProps {
  tableId: string;
  restaurantId: string;
}

export const DeleteTableButton = ({
  tableId,
  restaurantId,
}: DeleteTableButtonProps) => {
  const router = useRouter();
  const [deleteTable, { loading }] = useMutation(DeleteTableDocument, {
    variables: { id: tableId },
    onCompleted: () => {
      toast.success("Table supprimée avec succès");
      router.refresh();
    },
    onError: (error) => {
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
              (t: GetRestaurantTablesQuery["getRestaurantTables"][number]) =>
                t.id !== tableId,
            ),
          },
        });
      }
    },
  });

  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors h-8 w-8"
      onClick={(e) => {
        e.stopPropagation();
        deleteTable();
      }}
      disabled={loading}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
};
