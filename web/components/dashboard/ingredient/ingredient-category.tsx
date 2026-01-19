"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CreateIngredientCategoryDocument,
  GetRestaurantIngredientCategoriesDocument,
} from "@/graphql/__generated__/graphql";
import { useMutation, useQuery } from "@apollo/client/react";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface IngredientCategoryProps {
  restaurantId: string;
  onCategorySelect?: (categoryId: string) => void;
  selectedCategoryId?: string | null;
}

export const IngredientCategory = ({
  restaurantId,
  onCategorySelect,
  selectedCategoryId,
}: IngredientCategoryProps) => {
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const nameRef = useRef("");
  const { data, loading, error } = useQuery(
    GetRestaurantIngredientCategoriesDocument,
    {
      variables: {
        restaurantId,
      },
    },
  );

  const [createIngredientCategory, { loading: creating }] = useMutation(
    CreateIngredientCategoryDocument,
    {
      onCompleted: (data) => {
        toast.success("Categorie ajouter avec succes");
        setIsCreatingCategory(false);
        nameRef.current = "";
        if (onCategorySelect && data.createIngredientCategory) {
          onCategorySelect(data.createIngredientCategory.id);
        }
      },
      update: (cache, { data }) => {
        const existingData = cache.readQuery({
          query: GetRestaurantIngredientCategoriesDocument,
          variables: {
            restaurantId,
          },
        });
        if (
          existingData &&
          data &&
          existingData.getRestaurantIngredientCategories
        ) {
          cache.writeQuery({
            query: GetRestaurantIngredientCategoriesDocument,
            variables: {
              restaurantId,
            },
            data: {
              getRestaurantIngredientCategories: [
                ...existingData.getRestaurantIngredientCategories,
                data?.createIngredientCategory,
              ],
            },
          });
        }
      },
    },
  );

  const handleSubmit = () => {
    console.log(nameRef.current, restaurantId);
    createIngredientCategory({
      variables: {
        name: nameRef.current,
        restaurantId,
      },
    });
  };

  const categories = data?.getRestaurantIngredientCategories;
  return (
    <div className="flex justify-end gap-2 w-full">
      {isCreatingCategory ? (
        <div className="flex flex-1 gap-2 items-center animate-in fade-in zoom-in duration-300">
          <Input
            autoFocus
            name="name"
            placeholder="Nom de la categorie"
            onChange={(e) => (nameRef.current = e.target.value)}
            className="h-10"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
              if (e.key === "Escape") setIsCreatingCategory(false);
            }}
          />
          <Button
            disabled={creating}
            type="button"
            onClick={handleSubmit}
            size="sm"
          >
            {creating ? "Ajout..." : "Ok"}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCreatingCategory(false)}
            type="button"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : !categories || categories.length === 0 ? (
        <Button
          onClick={() => setIsCreatingCategory(true)}
          className="w-full"
          variant="outline"
          disabled={loading}
        >
          {loading ? "Chargement..." : "Créer une catégorie"}
        </Button>
      ) : (
        <div className="flex w-full gap-2">
          <Select
            onValueChange={onCategorySelect}
            value={selectedCategoryId || undefined}
          >
            <SelectTrigger disabled={loading}>
              <SelectValue placeholder="Sélectionner une catégorie" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsCreatingCategory(true)}
            type="button"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
