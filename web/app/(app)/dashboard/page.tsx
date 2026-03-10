import { redirect } from "next/navigation";
import { getServerApolloClient } from "@/lib/apollo-client-server";
import { MeDocument } from "@/graphql/__generated__/graphql";

export default async function DashboardPage() {
  let me;
  try {
    const client = await getServerApolloClient();
    const { data } = await client.query({ query: MeDocument });
    me = data?.me;
  } catch {
    redirect("/sign-in");
  }

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
