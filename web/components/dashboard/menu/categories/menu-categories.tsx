import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Menu } from "@/graphql/__generated__/graphql";
import { AddACategoryButton } from "./add-acategory-button";

interface MenuCategoriesProps {
  disabled?: boolean;
  categories?: Menu["categories"];
}

export const MenuCategories = ({
  disabled,
  categories,
}: MenuCategoriesProps) => {
  return (
    <Card className="flex-1 ">
      <CardContent className="flex items-center justify-between gap-2">
        <Select disabled={disabled || !categories?.length}>
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
