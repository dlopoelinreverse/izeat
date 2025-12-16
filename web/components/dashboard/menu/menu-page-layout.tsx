import MenuCategories from "./menu-categories";
import { MenuName } from "./menu-name";
import { GetMenuByIdQuery, Menu } from "@/graphql/__generated__/graphql";

interface MenuPageProps {
  restaurantId: string;
  isCreation?: boolean;
  menu?: GetMenuByIdQuery["getMenuById"]["menu"] | Menu;
}

export default function MenuPageLayout({
  restaurantId,
  isCreation,
  menu,
}: MenuPageProps) {
  return (
    <main className="w-full h-full flex flex-col gap-4">
      <div className="w-full flex justify-between items-center gap-4">
        <MenuName
          restaurantId={restaurantId}
          isCreation={isCreation}
          menuName={menu?.name}
        />
        <MenuCategories disabled={isCreation} />
      </div>
    </main>
  );
}
