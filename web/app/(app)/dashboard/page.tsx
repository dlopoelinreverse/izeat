import { redirect } from "next/navigation";
import { getServerApolloClient } from "@/lib/apollo-client-server";
import { MeDocument } from "@/graphql/__generated__/graphql";

export default async function DashboardPage() {
  const client = await getServerApolloClient();

  const { data, error } = await client.query({ query: MeDocument });

  const me = data?.me;

  if (!me) {
    redirect("/sign-in");
  }

  if (!me.onboarding?.hasRestaurant) {
    redirect("/onboarding");
  }

  if (!me.hasActiveSubscription) {
    redirect("/subscription");
  }

  redirect(`/dashboard/${me.onboarding!.restaurantId}/menus`);
}
