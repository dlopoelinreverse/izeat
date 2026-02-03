import { GetMenuQuery } from "@/graphql/__generated__/graphql";
import { EmptyState } from "../empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

interface MenuEditionProps {
  menu: GetMenuQuery["getMenu"];
}

export const MenuEdition = ({ menu }: MenuEditionProps) => {
  return (
    <div className="min-h-full w-full px-4">
      <p>Les categories de {menu?.name} :</p>
      <div className="flex flex-wrap gap-4 justify-start">
        {menu.categories?.length ? (
          <ul className="flex flex-col gap-4 w-full">
            {menu?.categories?.map((category) => (
              <Card key={category.id}>
                <CardContent className="flex justify-between items-center">
                  <div className="flex items-center gap-2 flex-1">
                    <p>{category.name}</p>
                    {category.items && category.items.length ? (
                      <p>
                        {category.items.length} plat
                        {category.items.length > 1 && "s"}
                      </p>
                    ) : (
                      <p>Aucun plat</p>
                    )}
                  </div>
                  <Button variant="ghost" size="icon">
                    <Pencil />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </ul>
        ) : (
          <EmptyState
            title="Aucune catégorie"
            description="Aucune catégorie n'a été ajoutée à ce menu"
          />
        )}
      </div>
    </div>
  );
};
