import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { DeleteMenuButton } from "./delete-menu-button";
import { GetMenusQuery } from "@/graphql/__generated__/graphql";
import Link from "next/link";

interface MenuListProps {
  menus: GetMenusQuery["getMenus"];
}

export const MenuList = ({ menus }: MenuListProps) => {
  return (
    <ul className="flex flex-col gap-4">
      {menus?.map((menu) => (
        <Card key={menu.id}>
          <CardContent>
            <Link
              href={`/app/dashboard/${menu.restaurantId}/menu/${menu.id}`}
              className="flex items-center justify-between"
            >
              <CardDescription>{menu.name}</CardDescription>
              <DeleteMenuButton menuId={menu.id} />
            </Link>
          </CardContent>
        </Card>
      ))}
    </ul>
  );
};
