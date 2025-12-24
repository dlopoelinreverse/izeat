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
import { useQueryState } from "nuqs";
import { DeleteCategoryButton } from "./delete-category-button";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface MenuCategoriesProps {
  disabled?: boolean;
  menu?: GetMenuQuery["getMenu"];
}

export const MenuCategories = ({ disabled, menu }: MenuCategoriesProps) => {
  const router = useRouter();
  const { categories } = menu || {};
  const [categoryId, setCategoryId] = useQueryState("categoryId");

  useEffect(() => {
    if (categories?.length === 0) {
      setCategoryId(null);
    }

    if (categories && categories?.length > 0 && !categoryId) {
      setCategoryId(categories[0].id);
    }

    if (categories?.length && categoryId) {
      setCategoryId(categories[categories.length - 1].id);
    }

    if (categoryId && !categories?.length) {
      setCategoryId(null);
    }
  }, [categories, setCategoryId, categoryId]);

  const onDeleteCategory = () => {
    router.refresh();
  };

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
        <div className="flex items-center gap-2">
          <DeleteCategoryButton
            categoryId={categoryId || ""}
            disabled={!categoryId}
            onDeleted={onDeleteCategory}
          />
          <AddACategoryButton
            menuId={menu?.id || ""}
            onAdd={router.refresh}
            disabled={disabled}
          />
        </div>
      </CardContent>
    </Card>
  );
};
