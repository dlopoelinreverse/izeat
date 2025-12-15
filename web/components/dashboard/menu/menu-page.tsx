import { MenuName } from "./menu-name";

interface MenuPageProps {
  restaurantId: string;
  isCreation?: boolean;
}

export default function MenuPage({ restaurantId, isCreation }: MenuPageProps) {
  return (
    <main className="w-full h-full flex flex-col gap-4">
      <MenuName restaurantId={restaurantId} isCreation={isCreation} />
    </main>
  );
}
