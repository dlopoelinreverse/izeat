import { GetMenuQuery } from "@/graphql/__generated__/graphql";

interface MenuEditionProps {
  menu: GetMenuQuery["getMenu"];
}

export const MenuEdition = ({ menu }: MenuEditionProps) => {
  return (
    <div className="min-h-full w-full p-4">
      <p>MenuEdition</p>
    </div>
  );
};
