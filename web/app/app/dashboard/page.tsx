import { redirect } from "next/navigation";
import { getServerApolloClient } from "@/lib/apollo-client-server";
import { MeDocument } from "@/graphql/__generated__/graphql";

export default async function DashboardPage() {
  const client = await getServerApolloClient();

  // .catch() évite le try/catch — redirect() ne doit pas être appelé dans un try/catch
  // car Next.js l'implémente en lançant une erreur interne (NEXT_REDIRECT)
  const result = await client
    .query({ query: MeDocument })
    .catch(() => null);

  const me = result?.data?.me ?? null;

  if (!me) {
    redirect("/auth/sign-in");
  }

  if (!me.onboarding?.hasRestaurant) {
    redirect("/app/onboarding");
  }

  if (!me.hasActiveSubscription) {
    redirect("/app/subscription");
  }

  redirect(`/app/dashboard/${me.onboarding!.restaurantId}/menus`);
}
