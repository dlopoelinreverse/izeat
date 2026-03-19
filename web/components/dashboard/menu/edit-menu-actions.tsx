"use client";

import { useState } from "react";
import { MenuName } from "./menu-name";
import { CreateMenuCategory } from "./categories/create-menu-category";
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
    <>
      {/* Desktop : nom éditable + bouton catégorie côte à côte */}
      <div className="hidden md:flex justify-between items-center w-full gap-3">
        <MenuName
          menuId={menu.id}
          menuName={menu.name}
          restaurantId={restaurantId}
          isEditing={isNameEditing}
          setIsEditing={setIsNameEditing}
        />
        {!isNameEditing && (
          <CreateMenuCategory menu={menu} restaurantId={restaurantId} />
        )}
      </div>

      {/* Mobile : bouton catégorie seul en sub-header */}
      <div className="md:hidden w-full">
        <CreateMenuCategory menu={menu} restaurantId={restaurantId} />
      </div>
    </>
  );
};
