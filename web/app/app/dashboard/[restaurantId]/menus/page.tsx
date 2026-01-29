import { MenuList } from "@/components/dashboard/menu/menu-list";
import { GetMenusDocument } from "@/graphql/__generated__/graphql";
import { getServerApolloClient } from "@/lib/apollo-client-server";

export default async function MenuPage({
  params,
}: {
  params: Promise<{ restaurantId: string }>;
}) {
  const { restaurantId } = await params;
  const client = await getServerApolloClient();

  const { data, error } = await client.query({
    query: GetMenusDocument,
    variables: {
      restaurantId,
    },
    fetchPolicy: "cache-first",
  });

  if (!data || error) {
    return <>Erreur lors de la récupération des menus</>;
  }

  return <MenuList restaurantId={restaurantId} menus={data.getMenus} />;
}
