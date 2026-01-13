"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
}

export const IngredientCategory = ({
  restaurantId,
}: IngredientCategoryProps) => {
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const nameRef = useRef("");
  const { data, loading, error } = useQuery(
    GetRestaurantIngredientCategoriesDocument,
    {
      variables: {
        restaurantId,
      },
    }
  );

  const [createIngredientCategory, { loading: creating }] = useMutation(
    CreateIngredientCategoryDocument,
    {
      onCompleted: (data) => {
        toast.success("Categorie ajouter avec succes");
        setIsCreatingCategory(false);
        nameRef.current = "";
        console.log(data);
      },
      refetchQueries: [
        {
          query: GetRestaurantIngredientCategoriesDocument,
          variables: {
            restaurantId,
          },
        },
      ],
    }
  );

  const handleSubmit = () => {
    createIngredientCategory({
      variables: {
        name: nameRef.current,
        restaurantId,
      },
    });
  };

  const categories = data?.getRestaurantIngredientCategories;
  return (
    <div className="flex justify-end gap-2">
      {isCreatingCategory ? (
        <>
          <Input
            name="name"
            placeholder="Nom de la categorie"
            onChange={(e) => (nameRef.current = e.target.value)}
          />
          <Button
            disabled={creating}
            type="button"
            onClick={handleSubmit}
            className="mt-2"
          >
            {creating ? "Ajout..." : "Ajouter"}
          </Button>
        </>
      ) : (
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsCreatingCategory(true)}
        >
          +
        </Button>
      )}
      <Select>
        <SelectTrigger disabled={loading || categories?.length === 0}>
          <SelectValue
            placeholder={
              loading
                ? "Chargement..."
                : categories?.length === 0
                ? "Ajoutez une categorie"
                : "Selectionner une categorie"
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
    </div>
  );
};
