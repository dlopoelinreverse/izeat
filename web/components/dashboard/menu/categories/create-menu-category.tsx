"use client";
import {
  CreateMenuCategoryDocument,
  GetMenuQuery,
} from "@/graphql/__generated__/graphql";
import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

interface MenuCategoriesProps {
  disabled?: boolean;
  menu: GetMenuQuery["getMenu"];
}

export const CreateMenuCategory = ({ disabled, menu }: MenuCategoriesProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const { id: menuId } = menu;

  const [createMenuCategory] = useMutation(CreateMenuCategoryDocument, {
    onCompleted: (data) => {
      setOpen(false);
      router.refresh();
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    if (!name) {
      return;
    }
    createMenuCategory({
      variables: {
        name,
        menuId,
      },
    });
  };

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <Plus /> Ajouter une catégorie
      </Button>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="max-h-[96vh] p-4">
          <div className="mx-auto w-full max-w-md flex flex-col h-full ">
            <DrawerHeader>
              <DrawerTitle>Ajouter une catégorie</DrawerTitle>
              <DrawerDescription>
                Ajoutez une catégorie à votre menu
              </DrawerDescription>
            </DrawerHeader>
            <form
              className="flex flex-col gap-4 w-full"
              onSubmit={handleSubmit}
            >
              <Input placeholder="Nom de la categorie" name="name" />
              <DrawerFooter className="flex-1 p-0">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setOpen(false)}
                >
                  Annuler
                </Button>
                <Button type="submit">Ajouter</Button>
              </DrawerFooter>
            </form>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};
