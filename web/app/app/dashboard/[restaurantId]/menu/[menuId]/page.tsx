import MenuPageLayout from "@/components/dashboard/menu/menu-page-layout";
import { MenuDocument } from "@/graphql/__generated__/graphql";
import { getServerApolloClient } from "@/lib/apollo-client-server";
export default async function MenuPage({
  params,
}: {
  params: Promise<{ restaurantId: string; menuId: string }>;
}) {
  const { restaurantId, menuId } = await params;

  const client = await getServerApolloClient();

  const { data } = await client.query({
    query: MenuDocument,
    variables: { menuId },
  });

  const menu = data?.menu;

  if (!menu) {
    return <p>Menu non trouvé</p>;
  }

  return <MenuPageLayout restaurantId={restaurantId} menu={menu.menu} />;
}
