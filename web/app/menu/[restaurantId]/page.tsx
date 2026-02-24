import Link from "next/link";
import { GetActiveMenuDocument } from "@/graphql/__generated__/graphql";
import { getServerApolloClient } from "@/lib/apollo-client-server";
import { UtensilsCrossed, ChevronRight } from "lucide-react";

export default async function MenuPage({
  params,
  searchParams,
}: {
  params: Promise<{ restaurantId: string }>;
  searchParams: Promise<{ table?: string }>;
}) {
  const { restaurantId } = await params;
  const { table } = await searchParams;

  const client = await getServerApolloClient();
  const { data } = await client.query({
    query: GetActiveMenuDocument,
    variables: { restaurantId },
  });

  const menu = data?.getActiveMenu;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="h-5 w-5 text-primary" />
            <span className="font-bold text-lg">{menu?.name ?? "Menu"}</span>
          </div>
          {table && (
            <span className="text-xs font-medium bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
              Table en cours
            </span>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-6">
        {!menu ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <UtensilsCrossed className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold">Menu non disponible</h2>
            <p className="text-muted-foreground mt-2 text-sm">
              Le menu de ce restaurant n&apos;est pas disponible pour le moment.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-muted-foreground text-sm">
              Bienvenue&nbsp;! Découvrez notre menu.
            </p>
            <div className="space-y-2">
              {menu.categories && menu.categories.length > 0 ? (
                menu.categories.map((category) => {
                  const href = table
                    ? `/menu/${restaurantId}/${category.id}?table=${table}`
                    : `/menu/${restaurantId}/${category.id}`;
                  return (
                    <Link
                      key={category.id}
                      href={href}
                      className="flex items-center justify-between w-full h-14 px-4 rounded-lg border bg-background hover:bg-accent transition-colors"
                    >
                      <span className="font-medium">{category.name}</span>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span className="text-xs">
                          {category.items?.length ?? 0} plat
                          {(category.items?.length ?? 0) !== 1 ? "s" : ""}
                        </span>
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </Link>
                  );
                })
              ) : (
                <p className="text-center text-muted-foreground text-sm py-8">
                  Aucune catégorie disponible dans ce menu.
                </p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
