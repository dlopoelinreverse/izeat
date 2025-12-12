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
    redirect(`/app/dashboard/${restaurantId}/menu/create`);
  }

  return <div>restaurantId: {restaurantId}</div>;
}
