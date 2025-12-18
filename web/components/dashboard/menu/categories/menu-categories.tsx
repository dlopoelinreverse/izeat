"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GetMenuQuery } from "@/graphql/__generated__/graphql";
import { AddACategoryButton } from "./add-acategory-button";

interface MenuCategoriesProps {
  disabled?: boolean;
  menu?: GetMenuQuery["getMenu"];
}

export const MenuCategories = ({ disabled, menu }: MenuCategoriesProps) => {
  const { categories } = menu || {};

  // On select change update the query url with the selected category id

  return (
    <Card className="flex-1 ">
      <CardContent className="flex items-center justify-between gap-2">
        <Select
          disabled={disabled || !categories?.length}
          onValueChange={(value) => console.log(value)}
          // defaultValue={categories?.[0]?.id}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={
                categories?.length
                  ? "Selectionner une categorie"
                  : "Creer d'abord une categorie"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {categories?.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div>
          <AddACategoryButton />
        </div>
      </CardContent>
    </Card>
  );
};
