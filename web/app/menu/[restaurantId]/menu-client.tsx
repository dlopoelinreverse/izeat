"use client";

import { useQuery } from "@apollo/client/react";
import {
  GetActiveMenuDocument,
  GetRestaurantTablesDocument,
} from "@/graphql/__generated__/graphql";
import { UtensilsCrossed } from "lucide-react";

interface MenuClientProps {
  restaurantId: string;
  tableId?: string;
}

export const MenuClient = ({ restaurantId, tableId }: MenuClientProps) => {
  const { data: menuData, loading: menuLoading } = useQuery(
    GetActiveMenuDocument,
    { variables: { restaurantId } },
  );

  const { data: tablesData } = useQuery(GetRestaurantTablesDocument, {
    variables: { restaurantId },
    skip: !tableId,
  });

  const menu = menuData?.getActiveMenu;
  const table = tablesData?.getRestaurantTables.find((t) => t.id === tableId);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="h-5 w-5 text-primary" />
            <span className="font-bold text-lg">
              {menu?.name ?? "Menu"}
            </span>
          </div>
          {table && (
            <span className="text-sm font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
              Table {table.number}
            </span>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="max-w-md mx-auto px-4 py-6">
        {menuLoading && (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-3">
                <div className="h-6 bg-muted rounded animate-pulse w-1/3" />
                <div className="space-y-2">
                  {[1, 2].map((j) => (
                    <div key={j} className="h-20 bg-muted rounded-lg animate-pulse" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {!menuLoading && !menu && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <UtensilsCrossed className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold">Menu non disponible</h2>
            <p className="text-muted-foreground mt-2 text-sm">
              Le menu de ce restaurant n&apos;est pas disponible pour le moment.
            </p>
          </div>
        )}

        {!menuLoading && menu && (
          <div className="space-y-8">
            {menu.categories && menu.categories.length > 0 ? (
              menu.categories.map((category) => (
                <section key={category.id}>
                  <h2 className="text-lg font-bold mb-3 pb-2 border-b">
                    {category.name}
                  </h2>
                  <div className="space-y-3">
                    {category.items && category.items.length > 0 ? (
                      category.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start justify-between gap-4 p-3 rounded-lg border bg-card hover:shadow-sm transition-shadow"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm leading-snug">
                              {item.name}
                            </p>
                            {item.description && (
                              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                {item.description}
                              </p>
                            )}
                          </div>
                          <span className="text-sm font-bold text-primary whitespace-nowrap shrink-0">
                            {item.price.toFixed(2)} €
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Aucun plat dans cette catégorie.
                      </p>
                    )}
                  </div>
                </section>
              ))
            ) : (
              <p className="text-center text-muted-foreground text-sm py-8">
                Aucune catégorie disponible dans ce menu.
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
