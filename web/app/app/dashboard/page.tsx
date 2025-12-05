import { GetRestaurantsDocument } from "@/graphql/__generated__/graphql";
import { getServerApolloClient } from "@/lib/apollo-client-server";

export default async function DashboardPage() {
  const client = await getServerApolloClient();

  const { data, error } = await client.query({ query: GetRestaurantsDocument });

  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  );
}
