import { cache } from "react";
import { getServerApolloClient } from "./apollo-client-server";
import { GetDashboardRestaurantStatusDocument } from "@/graphql/__generated__/graphql";

export const getDashboardStatus = cache(async () => {
  const client = await getServerApolloClient();
  const { data } = await client.query({
    query: GetDashboardRestaurantStatusDocument,
    fetchPolicy: "cache-first",
  });
  if (!data?.getDashboardRestaurantStatus) {
    return {
      step: "NO_RESTAURANT",
      checks: {
        hasRestaurant: false,
        hasMenu: false,
        hasTable: false,
        isServiceReady: false,
      },
    };
  }

  const hasMenu =
    data.getDashboardRestaurantStatus.menus &&
    data.getDashboardRestaurantStatus.menus.length > 0 &&
    data.getDashboardRestaurantStatus.menus[0].items.length > 0 &&
    data.getDashboardRestaurantStatus.menus[0].items[0].category.id;
  const hasTable =
    data.getDashboardRestaurantStatus.tables &&
    data.getDashboardRestaurantStatus.tables.length > 0;

  return {
    step: "READY",
    restaurantId: data.getDashboardRestaurantStatus.id,
    checks: {
      hasRestaurant: true,
      hasMenu,
      hasTable,
      isServiceReady: hasMenu && hasTable,
    },
  };
});
