"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteMenuDocument } from "@/graphql/__generated__/graphql";
import { useMutation } from "@apollo/client/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const DeleteMenuButton = ({ menuId }: { menuId: string }) => {
  const router = useRouter();
  const [deleteMenu, { loading }] = useMutation(DeleteMenuDocument, {
    variables: {
      deleteMenuId: menuId,
    },
    onCompleted: () => {
      toast.success("Menu supprimé avec succès");
      router.refresh();
    },
    onError: (error) => {
      console.error(error);
      toast.error(error.message || "Erreur lors de la suppression du menu");
      router.refresh();
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
      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors h-8 w-8"
      onClick={handleDeleteMenu}
      disabled={loading}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
};
