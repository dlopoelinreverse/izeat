import MenuPageLayout from "@/components/dashboard/menu/menu-page-layout";
import { GetMenuByIdDocument } from "@/graphql/__generated__/graphql";
import { getServerApolloClient } from "@/lib/apollo-client-server";
export default async function MenuPage({
  params,
}: {
  params: Promise<{ restaurantId: string; menuId: string }>;
}) {
  const { restaurantId, menuId } = await params;

  const client = await getServerApolloClient();

  const { data } = await client.query({
    query: GetMenuByIdDocument,
    variables: { getMenuByIdId: menuId },
  });

  const menu = data?.getMenuById?.menu;

  if (!menu) {
    return <p>Menu non trouvé</p>;
  }

  return <MenuPageLayout restaurantId={restaurantId} menu={menu} />;
}
