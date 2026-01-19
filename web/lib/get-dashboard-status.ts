import { cache } from "react";
import { getServerApolloClient } from "./apollo-client-server";
import { RestaurantDashboardStatusDocument } from "@/graphql/__generated__/graphql";

export const getDashboardStatus = cache(async () => {
  const client = await getServerApolloClient();
  const { data, error } = await client.query({
    query: RestaurantDashboardStatusDocument,
    fetchPolicy: "cache-first",
  });

  if (error || !data) {
    console.error(error);
    return {
      restaurantName: "Nom du restaurant",
      step: "NO_RESTAURANT",
      checks: {
        hasRestaurant: false,
        hasMenu: false,
        hasTable: false,
        isServiceReady: false,
      },
    };
  }

  const { restaurantDashboardStatus } = data;

  if (restaurantDashboardStatus === null) {
    return {
      restaurantName: "Nom du restaurant",
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
    restaurantDashboardStatus?.menus &&
    restaurantDashboardStatus.menus.length > 0 &&
    restaurantDashboardStatus.menus[0].items.length > 0;
  const hasTable =
    restaurantDashboardStatus?.tables &&
    restaurantDashboardStatus.tables.length > 0;

  return {
    step: "READY",
    restaurantId: restaurantDashboardStatus?.id,
    restaurantName: restaurantDashboardStatus?.name,
    checks: {
      hasRestaurant: true,
      hasMenu,
      hasTable: hasMenu,
      isServiceReady: hasMenu && hasTable,
    },
  };
});
