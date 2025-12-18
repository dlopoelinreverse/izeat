"use client";

import { Button } from "@/components/ui/button";
import { useMutation } from "@apollo/client/react";
import { DeleteMenuCategoryDocument } from "@/graphql/__generated__/graphql";

interface DeleteCategoryButtonProps {
  categoryId: string;
  disabled?: boolean;
  onDeleted?: () => void;
}

export const DeleteCategoryButton = ({
  categoryId,
  disabled,
  onDeleted,
}: DeleteCategoryButtonProps) => {
  const [deleteMenuCategory, { loading }] = useMutation(
    DeleteMenuCategoryDocument,
    {
      onCompleted: () => {
        onDeleted?.();
      },
    }
  );
  return (
    <Button
      disabled={disabled || loading}
      variant="destructive"
      onClick={() => deleteMenuCategory({ variables: { categoryId } })}
    >
      Supprimer
    </Button>
  );
};
