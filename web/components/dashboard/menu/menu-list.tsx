import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Menu } from "@/graphql/__generated__/graphql";
import { DeleteMenuButton } from "./delete-menu-button";

interface MenuListProps {
  menus: Menu[];
}

export const MenuList = ({ menus }: MenuListProps) => {
  return (
    <ul className="flex flex-col gap-4">
      {menus.map((menu) => (
        <Card key={menu.id}>
          <CardContent className="flex items-center justify-between">
            <CardDescription>{menu.name}</CardDescription>
            <DeleteMenuButton menuId={menu.id} />
          </CardContent>
        </Card>
      ))}
    </ul>
  );
};
