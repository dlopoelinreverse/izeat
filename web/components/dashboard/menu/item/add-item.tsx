import { Card } from "@/components/ui/card";
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
import { Plus } from "lucide-react";
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

  const [createMenuItem] = useMutation(CreateMenuItemDocument, {
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
          "h-[150px] w-full max-w-[280px] cursor-pointer border-dashed border-2 flex flex-col items-center justify-center gap-2 hover:bg-accent hover:border-primary/50 transition-all group",
          !categoryId && "opacity-50 cursor-not-allowed",
        )}
        onClick={() => {
          if (categoryId) setOpen(true);
        }}
      >
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Plus className="w-6 h-6 text-primary" />
        </div>
        <div className="text-center px-4">
          <p className="font-medium">Ajouter un plat</p>
          <p className="text-xs text-muted-foreground mt-1">
            {categoryId
              ? `Dans ${categories?.find((c) => c.id === categoryId)?.name}`
              : "Choisissez une catégorie"}
          </p>
        </div>
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
