import { TableList } from "@/components/dashboard/table/table-list";
import { GetRestaurantTablesDocument } from "@/graphql/__generated__/graphql";
import { getServerApolloClient } from "@/lib/apollo-client-server";

export default async function TablePage({
  params,
}: {
  params: Promise<{ restaurantId: string }>;
}) {
  const { restaurantId } = await params;

  const client = await getServerApolloClient();

  const { data, error } = await client.query({
    query: GetRestaurantTablesDocument,
    variables: { restaurantId },
  });

  if (error) {
    console.error(error);
    return <p>Tables non trouvées</p>;
  }

  const tables = data?.getRestaurantTables;

  if (!tables) {
    return <p>Tables non trouvées</p>;
  }

  return <TableList restaurantId={restaurantId} tables={tables} />;
}
