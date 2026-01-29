import DashboardPageLayout from "@/components/dashboard/dashboard-page-layout";
import { EditMenuActions } from "@/components/dashboard/menu/edit-menu-actions";
import { GetMenuDocument } from "@/graphql/__generated__/graphql";
import { getServerApolloClient } from "@/lib/apollo-client-server";

export default async function MenuPage({
  params,
}: {
  params: Promise<{ restaurantId: string; menuId: string }>;
}) {
  const { restaurantId, menuId } = await params;

  const client = await getServerApolloClient();

  const { data, error } = await client.query({
    query: GetMenuDocument,
    variables: { menuId },
  });

  if (error) {
    console.error(error);
    return <p>Menu non trouvé</p>;
  }

  const menu = data?.getMenu;

  if (!menu) {
    return <p>Menu non trouvé</p>;
  }
  return (
    <DashboardPageLayout
      hasBackButton
      headerAction={<EditMenuActions menu={menu} restaurantId={restaurantId} />}
    >
      <></>
    </DashboardPageLayout>
  );
}
