import { MenuList } from "@/components/dashboard/menu/menu-list";
import { MenusDocument } from "@/graphql/__generated__/graphql";
import { getServerApolloClient } from "@/lib/apollo-client-server";
import { redirect } from "next/navigation";

export default async function MenuPage({
  params,
}: {
  params: Promise<{ restaurantId: string }>;
}) {
  const { restaurantId } = await params;
  const client = await getServerApolloClient();

  const { data, error } = await client.query({
    query: MenusDocument,
    variables: {
      restaurantId,
    },
  });

  if (error || !data) {
    console.error(error);
    return redirect(`/app/dashboard/${restaurantId}/menu/create`);
  }

  return <MenuList menus={data.menus} />;
}
