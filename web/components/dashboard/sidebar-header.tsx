import { SidebarHeader } from "@/components/ui/sidebar";
import { getServerApolloClient } from "@/lib/apollo-client-server";
import { Store } from "lucide-react";

export async function SidebarHeaderComponent() {
  const client = await getServerApolloClient();

  // const { data } = await client.query({
  //   query: GetUserRestaurantDocument,
  //   fetchPolicy: "cache-first",
  // });

  // const restaurantName = data?.getUserRestaurant?.name || "Nom du Restaurant";

  return (
    <SidebarHeader className="border-b border-sidebar-border h-14 ">
      <div className="flex items-center justify-between gap-2">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Store className="size-5" />
        </div>
        <div className="flex flex-col gap-0.5 group-data-[collapsible=icon]:hidden">
          <span className="text-sm font-semibold text-sidebar-foreground">
            Nom du Restaurant
          </span>
        </div>
      </div>
    </SidebarHeader>
  );
}
