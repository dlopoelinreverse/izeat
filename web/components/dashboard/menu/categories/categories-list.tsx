"use client";

import {
  GetMenuCategoriesDocument,
  GetMenuCategoriesQuery,
  ReorderMenuCategoriesDocument,
} from "@/graphql/__generated__/graphql";
import { useMutation, useQuery } from "@apollo/client/react";
import { EmptyState } from "../../empty-state";
import { Category } from "./category";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useEffect, useState } from "react";

export const CategoriesList = ({
  menuId,
  restaurantId,
}: {
  menuId: string;
  restaurantId: string;
}) => {
  const { data, loading, error } = useQuery(GetMenuCategoriesDocument, {
    variables: { menuId },
  });

  const [localCategories, setLocalCategories] = useState<
    GetMenuCategoriesQuery["getMenuCategories"]
  >([]);

  useEffect(() => {
    if (data?.getMenuCategories) {
      setLocalCategories(data.getMenuCategories);
    }
  }, [data]);

  const [reorderCategories] = useMutation(ReorderMenuCategoriesDocument);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = localCategories.findIndex((c) => c.id === active.id);
    const newIndex = localCategories.findIndex((c) => c.id === over.id);
    const reordered = arrayMove(localCategories, oldIndex, newIndex);

    setLocalCategories(reordered);

    // Optimistic cache update
    const existing = data;
    if (existing) {
      // Apollo cache update happens via the local state; mutation persists to server
    }

    reorderCategories({
      variables: {
        menuId,
        orderedIds: reordered.map((c) => c.id),
      },
      update(cache) {
        cache.writeQuery({
          query: GetMenuCategoriesDocument,
          variables: { menuId },
          data: { getMenuCategories: reordered },
        });
      },
    });
  };

  if (loading) {
    return <p className="text-sm text-muted-foreground">Chargement...</p>;
  }

  if (error) {
    return <p className="text-sm text-destructive">Erreur : {error.message}</p>;
  }

  if (!localCategories || localCategories.length === 0) {
    return (
      <EmptyState
        title="Aucune catégorie"
        description="Aucune catégorie n'a été ajoutée à ce menu"
      />
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={localCategories.map((c) => c.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-2">
          {localCategories.map((category, index) => (
            <Category
              key={category.id}
              category={category}
              index={index}
              menuId={menuId}
              restaurantId={restaurantId}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};
