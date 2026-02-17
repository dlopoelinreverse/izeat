import { Button } from "@/components/ui/button";
import {
  DeleteMenuItemDocument,
  GetMenuCategoriesDocument,
} from "@/graphql/__generated__/graphql";
import { useMutation } from "@apollo/client/react";

interface DeleteItemButtonProps {
  itemId: string;
  menuId: string;
  setOpen: (open: boolean) => void;
}

export const DeleteItemButton = ({
  itemId,
  menuId,
  setOpen,
}: DeleteItemButtonProps) => {
  const [deleteMenuItem, { error, loading }] = useMutation(
    DeleteMenuItemDocument,
    {
      onCompleted: () => {
        setOpen(false);
      },
      update(cache, { data }) {
        if (!data?.deleteMenuItem) return;

        const existing = cache.readQuery({
          query: GetMenuCategoriesDocument,
          variables: { menuId },
        });

        if (!existing?.getMenuCategories) return;

        const newCategories = existing.getMenuCategories.map((category) => ({
          ...category,
          items: category.items?.filter(
            (item) => item.id !== data.deleteMenuItem.id,
          ),
        }));

        cache.writeQuery({
          query: GetMenuCategoriesDocument,
          variables: { menuId },
          data: {
            getMenuCategories: newCategories,
          },
        });
      },
    },
  );

  console.log(error);

  return (
    <Button
      variant="destructive"
      type="button"
      className="w-full"
      disabled={loading}
      onClick={() => {
        if (confirm("Êtes-vous sûr de vouloir supprimer ce plat ?")) {
          if (itemId) {
            deleteMenuItem({
              variables: {
                deleteMenuItemId: itemId,
              },
            });
          }
        }
      }}
    >
      Supprimer le plat
    </Button>
  );
};
