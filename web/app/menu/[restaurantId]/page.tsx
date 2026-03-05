import { UtensilsCrossed } from "lucide-react";
import { MenuHomeSearch } from "@/components/client/menu-home-search";
import { MenuHomeHeader } from "@/components/client/menu-home-header";
import { getMenuForRestaurant } from "@/lib/get-menu";

export default async function MenuPage({
  params,
  searchParams,
}: {
  params: Promise<{ restaurantId: string }>;
  searchParams: Promise<{ table?: string; tableNum?: string }>;
}) {
  const { restaurantId } = await params;
  const { table } = await searchParams;

  const menu = await getMenuForRestaurant(restaurantId);

  return (
    <div className="min-h-screen bg-[#F7F4EF]">
      <MenuHomeHeader
        restaurantName={menu?.name ?? "Menu"}
        restaurantId={restaurantId}
      />

      {!menu ? (
        <main className="px-4 py-6 flex flex-col items-center justify-center min-h-[60vh] text-center">
          <UtensilsCrossed className="h-12 w-12 text-[#9A9690] mb-4" />
          <h2
            className="text-xl text-[#1A1714]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Menu non disponible
          </h2>
          <p className="text-[#9A9690] mt-2 text-sm">
            Le menu de ce restaurant n&apos;est pas disponible pour le moment.
          </p>
        </main>
      ) : (
        <main className="pb-6">
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
