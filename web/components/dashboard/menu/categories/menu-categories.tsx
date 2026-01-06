"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GetMenuCategoriesDocument,
  GetMenuQuery,
} from "@/graphql/__generated__/graphql";
import { AddCategoryButton } from "./add-category-button";
import { useQueryState } from "nuqs";
import { DeleteCategoryButton } from "./delete-category-button";
import { useEffect } from "react";
import { useQuery } from "@apollo/client/react";

interface MenuCategoriesProps {
  disabled?: boolean;
  menu?: GetMenuQuery["getMenu"];
}

export const MenuCategories = ({ disabled, menu }: MenuCategoriesProps) => {
  const { data, loading } = useQuery(GetMenuCategoriesDocument, {
    variables: {
      menuId: menu?.id || "",
    },
  });

  const categories = data?.getMenuCategories;

  const [categoryId, setCategoryId] = useQueryState("categoryId");

  useEffect(() => {
    if (!categories?.length) {
      if (categoryId) {
        setCategoryId(null);
      }
      return;
    }

    if (categoryId && categories.some((cat) => cat.id === categoryId)) {
      return;
    }

    setCategoryId(categories[0].id);
  }, [categories, setCategoryId, categoryId]);

  return (
    <Card className="flex-1 ">
      <CardContent className="flex items-center justify-between gap-2">
        <Select
          disabled={disabled || !categories?.length}
          onValueChange={(value) => {
            setCategoryId(value);
          }}
          value={categoryId || ""}
        >
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={
                loading
                  ? "Chargement..."
                  : categories?.length
                  ? "Selectionner une catégorie"
                  : "Créer d'abord une catégorie"
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
        <div className="flex items-center gap-2">
          <DeleteCategoryButton
            categoryId={categoryId || ""}
            disabled={!categoryId}
          />
          <AddCategoryButton menuId={menu?.id || ""} disabled={disabled} />
        </div>
      </CardContent>
    </Card>
  );
};
