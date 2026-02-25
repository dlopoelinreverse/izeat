import { GetActiveMenuDocument } from "@/graphql/__generated__/graphql";
import { getServerApolloClient } from "@/lib/apollo-client-server";
import { UtensilsCrossed } from "lucide-react";
import { MenuHomeSearch } from "@/components/client/menu-home-search";

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

      {!menu ? (
        <main className="px-4 py-6 flex flex-col items-center justify-center min-h-[60vh] text-center">
          <UtensilsCrossed className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold">Menu non disponible</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Le menu de ce restaurant n&apos;est pas disponible pour le moment.
          </p>
        </main>
      ) : (
        <main className="pb-6">
          <div className="px-4 pt-4 pb-2">
            <p className="text-muted-foreground text-sm">
              Bienvenue&nbsp;! Découvrez notre menu.
            </p>
          </div>
          <MenuHomeSearch
            menu={menu}
            restaurantId={restaurantId}
            tableId={table}
          />
        </main>
      )}
    </div>
  );
}
