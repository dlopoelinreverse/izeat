"use client";

import { Button } from "@/components/ui/button";
import { DeleteMenuDocument } from "@/graphql/__generated__/graphql";
import { useMutation } from "@apollo/client/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const DeleteMenuButton = ({ menuId }: { menuId: string }) => {
  const router = useRouter();
  const [deleteMenu, { loading }] = useMutation(DeleteMenuDocument, {
    onCompleted: ({ deleteMenu }) => {
      const { success, message } = deleteMenu;

      if (success) {
        toast.success(message);
        router.refresh();
      }
    },
  });
  const handleDeleteMenu = () => {
    deleteMenu({
      variables: {
        deleteMenuId: menuId,
      },
    });
  };
  return (
    <Button variant="destructive" onClick={handleDeleteMenu} disabled={loading}>
      Supprimer
    </Button>
  );
};
