import { cache } from "react";
import { getServerApolloClient } from "./apollo-client-server";
import { RestaurantDashboardStatusDocument } from "@/graphql/__generated__/graphql";

export const getDashboardStatus = cache(async () => {
  const client = await getServerApolloClient();
  const { data } = await client.query({
    query: RestaurantDashboardStatusDocument,
    fetchPolicy: "cache-first",
  });

  if (!data) {
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

  const { restaurantDashboardStatus } = data;

  if (restaurantDashboardStatus.restaurant === null) {
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
    restaurantDashboardStatus.restaurant?.menus &&
    restaurantDashboardStatus.restaurant.menus.length > 0 &&
    restaurantDashboardStatus.restaurant.menus[0].items.length > 0;
  const hasTable =
    restaurantDashboardStatus.restaurant?.tables &&
    restaurantDashboardStatus.restaurant.tables.length > 0;

  return {
    step: "READY",
    restaurantId: restaurantDashboardStatus.restaurant?.id,
    checks: {
      hasRestaurant: true,
      hasMenu,
      hasTable,
      isServiceReady: hasMenu && hasTable,
    },
  };
});
