"use client";
import {
  GetRestaurantIngredientsDocument,
  GetRestaurantIngredientsQuery,
} from "@/graphql/__generated__/graphql";
import { useQuery } from "@apollo/client/react";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Card } from "@/components/ui/card";
import { Check, Plus, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { CreateIngredient } from "./create-ingredient";

interface IngredientsListProps {
  restaurantId: string;
}

type Ingredient = NonNullable<
  GetRestaurantIngredientsQuery["getRestaurantIngredients"]
>[number];

export const IngredientsList = ({ restaurantId }: IngredientsListProps) => {
  const [query, setQuery] = useState("");

  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>(
    []
  );

  const { data, loading, error } = useQuery(GetRestaurantIngredientsDocument, {
    variables: {
      restaurantId,
    },
  });

  const ingredients = data?.getRestaurantIngredients;

  const categoriesWithIngredients = ingredients?.reduce((acc, ingredient) => {
    const category = ingredient.ingredientCategory;
    if (!acc.find((item) => item.id === category.id)) {
      acc.push({
        id: category.id,
        name: category.name,
        ingredients: [ingredient],
      });
    } else {
      acc.find((item) => item.id === category.id)?.ingredients.push(ingredient);
    }
    return acc;
  }, [] as { id: string; name: string; ingredients: Ingredient[] }[]);

  const handleSelect = (ingredient: Ingredient) => {
    if (!selectedIngredients.find((item) => item.id === ingredient.id)) {
      setSelectedIngredients([...selectedIngredients, ingredient]);
    }
  };

  const hasExactMatch = ingredients?.some(
    (ingredient) => ingredient.name.toLowerCase() === query.toLowerCase()
  );

  return (
    <div className="flex flex-col gap-4 w-full ">
      <Command className="rounded-md border">
        <CommandInput
          placeholder="Rechercher ou ajouter un ingrédient..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>Aucun ingrédient trouvé.</CommandEmpty>
          {categoriesWithIngredients?.map((category) => (
            <div key={category.id}>
              <CommandGroup heading={category.name}>
                {category.ingredients.map((ingredient) => (
                  <CommandItem
                    key={ingredient.id}
                    onSelect={() => handleSelect(ingredient)}
                    className="cursor-pointer"
                    disabled={
                      selectedIngredients.find(
                        (item) => item.id === ingredient.id
                      )
                        ? true
                        : false
                    }
                  >
                    <Plus className=" h-4 w-4" />
                    <span>{ingredient.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
            </div>
          ))}
          {!hasExactMatch && query.length > 1 && (
            <CreateIngredient query={query} />
          )}
        </CommandList>
      </Command>

      {selectedIngredients.length > 0 && (
        <>
          <Label>Ingrédients sélectionnés</Label>
          <div className="flex flex-wrap gap-2 rounded-md border p-2">
            {selectedIngredients.map((item) => (
              <Badge
                key={item.id}
                variant="outline"
                className="hover:bg-accent hover:text-accent-foreground transition-colors"
                onClick={() =>
                  setSelectedIngredients(
                    selectedIngredients.filter((i) => i.id !== item.id)
                  )
                }
              >
                {item.name}
                <X className=" h-4 w-4 " />
              </Badge>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
