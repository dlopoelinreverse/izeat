"use client";

import { Badge } from "@/components/ui/badge";

export const CreateIngredient = () => {
  return (
    <Badge
      variant="outline"
      className="cursor-pointer hover:bg-accent transition-colors"
    >
      + Ajouter un ingrédient
    </Badge>
  );
};
