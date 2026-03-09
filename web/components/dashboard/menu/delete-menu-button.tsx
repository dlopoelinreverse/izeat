"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DeleteMenuDocument,
  GetMenusDocument,
  GetMenusQuery,
} from "@/graphql/__generated__/graphql";
import { useMutation } from "@apollo/client/react";
import { toast } from "sonner";
import { useOnboarding } from "@/contexts/onboarding-context";

export const DeleteMenuButton = ({
  menuId,
  restaurantId,
}: {
  menuId: string;
  restaurantId: string;
}) => {
  const { refetchOnboarding } = useOnboarding();
  const [deleteMenu, { loading }] = useMutation(DeleteMenuDocument, {
    variables: {
      deleteMenuId: menuId,
    },
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

  const handleDeleteMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteMenu();
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors h-7 w-7"
      onClick={handleDeleteMenu}
      disabled={loading}
    >
      <Trash2 className="size-3.5" />
    </Button>
  );
};
