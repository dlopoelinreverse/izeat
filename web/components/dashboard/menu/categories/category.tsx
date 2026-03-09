"use client";
import { GetMenuCategoriesQuery } from "@/graphql/__generated__/graphql";
import { DeleteCategoryButton } from "./delete-category-button";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, ChevronRight } from "lucide-react";
import Link from "next/link";

export const Category = ({
  category,
  restaurantId,
  menuId,
  index,
}: {
  category: GetMenuCategoriesQuery["getMenuCategories"][number];
  restaurantId: string;
  menuId: string;
  index: number;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2">
      {/* Drag handle */}
      <button
        className="cursor-grab text-muted-foreground hover:text-foreground shrink-0 touch-none"
        {...attributes}
        {...listeners}
        onClick={(e) => e.preventDefault()}
        aria-label="Réorganiser"
      >
        <GripVertical className="size-4" />
      </button>

      {/* Category row — navigates to category detail page on click */}
      <Link
        href={`/app/dashboard/${restaurantId}/menus/${menuId}/${category.id}`}
        className="flex-1 flex items-center gap-3 px-4 py-3 bg-card border border-border rounded-xl hover:bg-secondary/50 transition-colors group"
      >
        <span className="text-xs text-muted-foreground w-5 text-center font-medium shrink-0">
          {index + 1}
        </span>

        <span className="text-sm font-medium flex-1 text-foreground">{category.name}</span>

        <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-md shrink-0">
          {category.items?.length ?? 0} plat{(category.items?.length ?? 0) > 1 ? "s" : ""}
        </span>

        <ChevronRight className="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
      </Link>

      {/* Delete button — outside the Link to avoid navigation */}
      <div onClick={(e) => e.stopPropagation()}>
        <DeleteCategoryButton categoryId={category.id} />
      </div>
    </div>
  );
};
