"use client";

import { useState } from "react";
import { MenuName } from "./menu-name";
import { MenuCategories } from "./categories/menu-categories";
import { GetMenuQuery } from "@/graphql/__generated__/graphql";

interface EditMenuActionsProps {
  menu: GetMenuQuery["getMenu"];
  restaurantId: string;
}

export const EditMenuActions = ({
  menu,
  restaurantId,
}: EditMenuActionsProps) => {
  const [isNameEditing, setIsNameEditing] = useState(false);
  return (
    <div className="flex justify-between items-center w-full">
      <MenuName
        menuName={menu.name}
        restaurantId={restaurantId}
        isEditing={isNameEditing}
        setIsEditing={setIsNameEditing}
      />
      {!isNameEditing && <MenuCategories menu={menu} />}
    </div>
  );
};
