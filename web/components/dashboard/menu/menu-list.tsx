import { Card, CardContent } from "@/components/ui/card";
import { Menu } from "@/graphql/__generated__/graphql";

interface MenuListProps {
  menus: Menu[];
}

export const MenuList = ({ menus }: MenuListProps) => {
  return (
    <ul className="flex flex-col gap-4">
      {menus.map((menu) => (
        <Card key={menu.id}>
          <CardContent>{menu.name}</CardContent>
        </Card>
      ))}
    </ul>
  );
};
