import { Card, CardContent, CardFooter } from "@/components/ui/card";
import clsx from "clsx";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreateMenuItemDocument } from "@/graphql/__generated__/graphql";
import { useMutation } from "@apollo/client/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  IngredientType,
  IngredientsList,
} from "../../ingredient/ingredients-list";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useRouter } from "next/navigation";

interface AddItemProps {
  categoryId?: string | null;
  categories?: { id: string; name: string }[];
  restaurantId: string;
  menuId: string;
}

export const AddItem = ({
  categoryId,
  categories,
  restaurantId,
  menuId,
}: AddItemProps) => {
  const [open, setOpen] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState<
    IngredientType[]
  >([]);

  const router = useRouter();

  const [createMenuItem, { loading }] = useMutation(CreateMenuItemDocument, {
    refetchQueries: ["GetMenu"],
    onCompleted: () => {
      setOpen(false);
      setSelectedIngredients([]);
      router.refresh();
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!categoryId) return;

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;

    createMenuItem({
      variables: {
        menuItemInput: {
          name,
          ingredientsId: selectedIngredients.map((i) => i.id),
          categoryId,
          menuId,
        },
      },
    });
  };

  return (
    <>
      <Card
        className={clsx(
          "h-1/5 cursor-pointer border-dashed border-2 hover:bg-accent transition-colors",
          !categoryId && "opacity-50 cursor-not-allowed",
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
        <DrawerContent className="max-h-[96vh]">
          <div className="mx-auto w-full max-w-[800px] flex flex-col h-full overflow-hidden">
            <DrawerHeader>
              <DrawerTitle>Ajouter un plat</DrawerTitle>
              <DrawerDescription>
                Ajouter un plat à la catégorie{" "}
                {
                  categories?.find((category) => category.id === categoryId)
                    ?.name
                }
              </DrawerDescription>
            </DrawerHeader>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col flex-1 overflow-hidden"
            >
              <div className="flex-1 overflow-y-auto px-4 py-2 flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="item-name">Nom du plat</Label>
                  <Input
                    id="item-name"
                    name="name"
                    placeholder="Ex: Pizza Margherita"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Ingrédients</Label>
                  <IngredientsList
                    restaurantId={restaurantId}
                    selectedIngredients={selectedIngredients}
                    onIngredientsChange={setSelectedIngredients}
                  />
                </div>
              </div>

              <DrawerFooter className="border-t">
                <div className="flex flex-col gap-2 w-full">
                  <Button type="submit" className="w-full">
                    Ajouter le plat
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setOpen(false)}
                    className="w-full"
                  >
                    Annuler
                  </Button>
                </div>
              </DrawerFooter>
            </form>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};
