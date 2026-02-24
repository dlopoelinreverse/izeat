import Link from "next/link";
import { GetActiveMenuDocument } from "@/graphql/__generated__/graphql";
import { getServerApolloClient } from "@/lib/apollo-client-server";
import { ArrowLeft, UtensilsCrossed } from "lucide-react";
import { notFound } from "next/navigation";

export default async function MenuCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ restaurantId: string; categoryId: string }>;
  searchParams: Promise<{ table?: string }>;
}) {
  const { restaurantId, categoryId } = await params;
  const { table } = await searchParams;

  const client = await getServerApolloClient();
  const { data } = await client.query({
    query: GetActiveMenuDocument,
    variables: { restaurantId },
  });

  const menu = data?.getActiveMenu;
  const category = menu?.categories?.find((c) => c.id === categoryId);

  if (!menu || !category) notFound();

  const backHref = table
    ? `/menu/${restaurantId}?table=${table}`
    : `/menu/${restaurantId}`;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b">
        <div className="px-4 py-3 flex items-center gap-3">
          <Link
            href={backHref}
            className="flex items-center justify-center size-8 rounded-md hover:bg-accent transition-colors"
            aria-label="Retour"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <span className="font-bold text-lg">{category.name}</span>
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-6">
        {category.items && category.items.length > 0 ? (
          <div className="space-y-3">
            {category.items.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between gap-4 p-4 rounded-lg border bg-card"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm leading-snug">{item.name}</p>
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
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <UtensilsCrossed className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-sm">
              Aucun plat dans cette catégorie.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
