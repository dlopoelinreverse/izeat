import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { DeleteMenuButton } from "./delete-menu-button";
import { GetMenusQuery } from "@/graphql/__generated__/graphql";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface MenuListProps {
  menus: GetMenusQuery["getMenus"];
}

export const MenuList = ({ menus }: MenuListProps) => {
  return (
    <>
      <Link href={`/app/dashboard/${menus[0].restaurantId}/menus/create`}>
        <Button>Ajouter un menu</Button>
      </Link>
      <ul className="flex flex-col gap-4">
        {menus?.map((menu) => (
          <Card key={menu.id}>
            <CardContent className="flex items-center justify-between">
              <Link
                href={`/app/dashboard/${menu.restaurantId}/menu/${menu.id}`}
              >
                <CardDescription>{menu.name}</CardDescription>
              </Link>
              <DeleteMenuButton menuId={menu.id} />
            </CardContent>
          </Card>
        ))}
      </ul>
    </>
  );
};
