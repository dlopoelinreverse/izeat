"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { GetRestaurantIngredientsDocument } from "@/graphql/__generated__/graphql";
import { useQuery } from "@apollo/client/react";
import { CreateIngredient } from "./create-ingredient";
import { IngredientCategory } from "./ingredient-category";

interface IngredientsListProps {
  restaurantId: string;
}

export const IngredientsList = ({ restaurantId }: IngredientsListProps) => {
  const { data, loading, error } = useQuery(GetRestaurantIngredientsDocument, {
    variables: {
      restaurantId,
    },
  });
  return (
    <Card className="p-2">
      <CardContent>
        <IngredientCategory restaurantId={restaurantId} />
        <ul>
          <CreateIngredient />
          {data?.getRestaurantIngredients?.map((ingredient) => (
            <li key={ingredient.id}>
              <Badge>{ingredient.name}</Badge>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
