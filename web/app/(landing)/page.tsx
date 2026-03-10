import { redirect } from "next/navigation";
import { getServerApolloClient } from "@/lib/apollo-client-server";
import { MeDocument } from "@/graphql/__generated__/graphql";
import LandingPage from "./_landing-page";

export default async function Page() {
  try {
    const client = await getServerApolloClient();
    const { data } = await client.query({ query: MeDocument });
    if (data?.me) {
      redirect("/dashboard");
    }
  } catch {
    // Not authenticated or backend unreachable — render landing
  }
  return <LandingPage />;
}
