"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Pencil, X } from "lucide-react";

interface MenuNameProps {
  restaurantId: string;
  menuName: string;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
}

export const MenuName = ({
  menuName,
  isEditing,
  setIsEditing,
}: MenuNameProps) => {
  return (
    <div className="h-full flex items-center gap-2">
      {!isEditing ? (
        <>
          <h1 className="text-lg font-bold text-foreground">{menuName}</h1>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground"
            onClick={() => setIsEditing(true)}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
        </>
      ) : (
        <>
          <Input
            placeholder="Nom du menu"
            name="name"
            defaultValue={menuName}
            autoFocus
          />
          <Button
            variant="default"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={() => setIsEditing(false)}
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={() => setIsEditing(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
};
