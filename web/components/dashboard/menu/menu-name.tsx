"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, X } from "lucide-react";

interface MenuNameProps {
  restaurantId: string;
  menuName: string;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
}

export const MenuName = ({
  restaurantId,
  menuName,
  isEditing,
  setIsEditing,
}: MenuNameProps) => {
  return (
    <div className="h-full flex gap-2">
      {!isEditing ? (
        <>
          <h1 className="text-2xl font-bold">{menuName}</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(true)}
          >
            <Pencil className="h-4 w-4" />
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
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
};
