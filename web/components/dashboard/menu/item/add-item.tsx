import { Card, CardContent, CardFooter } from "@/components/ui/card";
import clsx from "clsx";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreateMenuItemDocument } from "@/graphql/__generated__/graphql";
import { useMutation } from "@apollo/client/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IngredientsList } from "../../ingredient/ingredients-list";
import { Drawer, DrawerContent, DrawerHeader } from "@/components/ui/drawer";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";

interface AddItemProps {
  categoryId?: string | null;
  categories?: { id: string; name: string }[];
  restaurantId: string;
}

export const AddItem = ({
  categoryId,
  categories,
  restaurantId,
}: AddItemProps) => {
  const [open, setOpen] = useState(false);

  const [createMenuItem, { loading }] = useMutation(CreateMenuItemDocument, {});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    createMenuItem({
      variables: {
        menuItemInput: {
          // name: formData.get("name") as string,
          // ingredients: formData.get("ingredients") as string,
          // categoryId,
          // restaurantId,
        },
      },
    });
    setOpen(false);
  };

  return (
    <>
      <Card
        className={clsx(
          "h-1/5 cursor-pointer border-dashed border-2 hover:bg-accent transition-colors",
          !categoryId && "opacity-50 cursor-not-allowed"
        )}
        onClick={() => {
          if (categoryId) setOpen(true);
        }}
      >
        <CardContent className="flex flex-col items-center justify-between h-full  ">
          Ajouter un plat
          <CardFooter>
            a la categorie{" "}
            {categories?.find((category) => category.id === categoryId)?.name}
          </CardFooter>
        </CardContent>
      </Card>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <div className="flex flex-col gap-2 p-2">
            <DrawerHeader>
              <DialogTitle>Ajouter un plat</DialogTitle>
              <DialogDescription>
                Ajouter un plat a la categorie{" "}
                {
                  categories?.find((category) => category.id === categoryId)
                    ?.name
                }
              </DialogDescription>
            </DrawerHeader>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <Input name="name" placeholder="Nom du plat" />
              <Label>Ingrédients</Label>
              <IngredientsList restaurantId={restaurantId} />

              <Button
                variant="outline"
                type="button"
                onClick={() => setOpen(false)}
              >
                Annuler
              </Button>
              <Button type="submit" asChild>
                Ajouter
              </Button>
            </form>
          </div>
        </DrawerContent>
      </Drawer>
      {/* <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
        <DrawerHeader>
            <DialogTitle>Ajouter un plat</DialogTitle>
            <DialogDescription>
              Ajouter un plat a la categorie{" "}
              {categories?.find((category) => category.id === categoryId)?.name}
            </DialogDescription>
          </DrawerHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <Input name="name" placeholder="Nom du plat" />
            <Label>Ingrédients</Label>
            <IngredientsList restaurantId={restaurantId} />
            <DialogFooter>
              <DialogClose>
                <Button variant="outline">Annuler</Button>
              </DialogClose>
              <Button type="submit" asChild>
                Ajouter
              </Button>
            </DialogFooter>
          </form>
        </DrawerContent>
      </Drawer> */}
    </>
  );
};
