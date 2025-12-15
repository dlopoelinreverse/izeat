import { MenuList } from "@/components/dashboard/menu/menu-list";
import { GetMenusByRestaurantIdDocument } from "@/graphql/__generated__/graphql";
import { getServerApolloClient } from "@/lib/apollo-client-server";
import { redirect } from "next/navigation";

export default async function MenuPage({
  params,
}: {
  params: Promise<{ restaurantId: string }>;
}) {
  const { restaurantId } = await params;
  const client = await getServerApolloClient();

  const { data } = await client.query({
    query: GetMenusByRestaurantIdDocument,
    variables: {
      restaurantId,
    },
  });

  const { success, menus } = data?.getMenusByRestaurantId || {};

  if (success && menus?.length === 0) {
    return redirect(`/app/dashboard/${restaurantId}/menu/create`);
  }

  if (menus) {
    return <MenuList menus={menus} />;
  }
}
