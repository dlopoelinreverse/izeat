"use client";

import { Button } from "@/components/ui/button";
import { useMutation } from "@apollo/client/react";
import { DeleteMenuCategoryDocument } from "@/graphql/__generated__/graphql";

interface DeleteCategoryButtonProps {
  categoryId: string;
  disabled?: boolean;
}

export const DeleteCategoryButton = ({
  categoryId,
  disabled,
}: DeleteCategoryButtonProps) => {
  const [deleteMenuCategory, { loading }] = useMutation(
    DeleteMenuCategoryDocument,
    {
      refetchQueries: ["GetMenuCategories"],
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
