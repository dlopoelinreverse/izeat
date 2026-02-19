"use client";

import { useState } from "react";
import { useQueryState } from "nuqs";
import { Carrot, ChevronDown } from "lucide-react";
import { useQuery } from "@apollo/client/react";
import { GetRestaurantIngredientCategoriesDocument } from "@/graphql/__generated__/graphql";
import { IngredientCategorySidebar } from "./ingredient-category-sidebar";
import { IngredientListPanel } from "./ingredient-list-panel";
import { EmptyState } from "@/components/dashboard/empty-state";
import DashboardPageLayout from "@/components/dashboard/dashboard-page-layout";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

interface IngredientsPageContentProps {
  restaurantId: string;
}

export const IngredientsPageContent = ({
  restaurantId,
}: IngredientsPageContentProps) => {
  const [selectedCategoryId, setSelectedCategoryId] = useQueryState("categoryId");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { data } = useQuery(GetRestaurantIngredientCategoriesDocument, {
    variables: { restaurantId },
  });

  const categories = data?.getRestaurantIngredientCategories ?? [];
  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

  const handleSelectCategory = (id: string | null) => {
    setSelectedCategoryId(id);
    setDrawerOpen(false);
  };

  return (
    <DashboardPageLayout title="Ingrédients">
      <div className="flex h-full">
        {/* Sidebar desktop */}
        <aside className="hidden md:flex w-56 shrink-0 border-r flex-col overflow-y-auto p-3">
          <IngredientCategorySidebar
            restaurantId={restaurantId}
            selectedCategoryId={selectedCategoryId}
            onSelect={setSelectedCategoryId}
          />
        </aside>

        {/* Contenu principal */}
        <section className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {/* Bouton catégorie mobile */}
          <div className="md:hidden">
            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => setDrawerOpen(true)}
            >
              <span className="flex items-center gap-2">
                <Carrot className="h-4 w-4 text-muted-foreground" />
                {selectedCategory ? selectedCategory.name : "Choisir une catégorie"}
              </span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>

          {selectedCategoryId ? (
            <IngredientListPanel
              restaurantId={restaurantId}
              selectedCategoryId={selectedCategoryId}
              categories={categories}
            />
          ) : (
            <EmptyState
              icon={Carrot}
              title="Sélectionnez une catégorie"
              description="Choisissez une catégorie pour afficher et gérer ses ingrédients."
            />
          )}
        </section>
      </div>

      {/* Drawer catégories mobile */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} direction="bottom">
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Catégories</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 overflow-y-auto max-h-[60vh]">
            <IngredientCategorySidebar
              restaurantId={restaurantId}
              selectedCategoryId={selectedCategoryId}
              onSelect={handleSelectCategory}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </DashboardPageLayout>
  );
};
