"use client";

import { Button } from "@/components/ui/button";
import { useMutation } from "@apollo/client/react";
import { DeleteMenuCategoryDocument } from "@/graphql/__generated__/graphql";
import { Trash2 } from "lucide-react";

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
      variant="ghost"
      size="icon"
      className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
      disabled={disabled || loading}
      onClick={() => deleteMenuCategory({ variables: { categoryId } })}
    >
      <Trash2 className="size-3.5" />
    </Button>
  );
};
