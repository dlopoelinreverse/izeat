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
      <div className="flex h-full overflow-hidden">
        {/* Sidebar desktop */}
        <aside className="hidden md:flex w-52 shrink-0 border-r flex-col overflow-hidden">
          <IngredientCategorySidebar
            restaurantId={restaurantId}
            selectedCategoryId={selectedCategoryId}
            onSelect={setSelectedCategoryId}
          />
        </aside>

        {/* Contenu principal */}
        <section className="flex-1 overflow-y-auto flex flex-col min-w-0">
          {/* Bouton pill catégorie mobile */}
          <div className="md:hidden px-4 pt-4 pb-2">
            <button
              onClick={() => setDrawerOpen(true)}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-secondary transition-colors"
            >
              <span className="flex items-center gap-2">
                <Carrot className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-semibold text-foreground">
                  {selectedCategory ? selectedCategory.name : "Choisir une catégorie"}
                </span>
              </span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>
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
          {/* Handle visuel */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-9 h-1 rounded-full bg-border" />
          </div>
          <DrawerHeader className="pb-3 border-b">
            <DrawerTitle className="text-base font-bold">Catégories</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 overflow-y-auto max-h-[65vh] pb-8">
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
