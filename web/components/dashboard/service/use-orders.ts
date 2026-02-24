import { useEffect, useRef, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { NetworkStatus } from "@apollo/client";
import {
  GetRestaurantOrdersDocument,
  OrderCreatedDocument,
  OrderUpdatedDocument,
  type GetRestaurantOrdersQuery,
  type OrderCreatedSubscription,
  type OrderCreatedSubscriptionVariables,
  type OrderUpdatedSubscription,
  type OrderUpdatedSubscriptionVariables,
} from "@/graphql/__generated__/graphql";
import type { Order } from "./service-types";

interface UseOrdersOptions {
  /** Called when a new order arrives via subscription (useful for toasts). */
  onOrderCreated?: (order: Order) => void;
}

interface UseOrdersResult {
  orders: Order[];
  loading: boolean;
  error: Error | undefined;
  subError: Error | undefined;
  networkStatus: NetworkStatus;
}

export function useOrders(
  restaurantId: string,
  options?: UseOrdersOptions,
): UseOrdersResult {
  const [subError, setSubError] = useState<Error | undefined>();

  // Keep a stable ref so the subscribeToMore callbacks never go stale
  const onOrderCreatedRef = useRef(options?.onOrderCreated);
  onOrderCreatedRef.current = options?.onOrderCreated;

  const queryResult = useQuery<GetRestaurantOrdersQuery>(
    GetRestaurantOrdersDocument,
    {
      variables: { restaurantId },
      // Fetch fresh data on mount, then serve updates from the cache
      fetchPolicy: "cache-and-network",
    },
  );

  const { subscribeToMore } = queryResult;

  useEffect(() => {
    if (!restaurantId) return;

    // ── Subscription : nouvelle commande ──────────────────────────────────
    const unsubCreate = subscribeToMore<
      OrderCreatedSubscription,
      OrderCreatedSubscriptionVariables
    >({
      document: OrderCreatedDocument,
      variables: { restaurantId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;

        const newOrder = subscriptionData.data.orderCreated;

        // Deduplicate (hot-reload, WS reconnection…)
        if (prev.getRestaurantOrders.some((o) => o.id === newOrder.id)) {
          return prev;
        }

        // Side-effect via stable ref — safe to call inside updateQuery
        onOrderCreatedRef.current?.(newOrder as Order);

        return {
          ...prev,
          getRestaurantOrders: [
            newOrder,
            ...prev.getRestaurantOrders,
          ] as GetRestaurantOrdersQuery["getRestaurantOrders"],
        };
      },
      onError: (err) => {
        console.error("[subscription:orderCreated]", err);
        setSubError(err);
      },
    });

    // ── Subscription : mise à jour de statut ──────────────────────────────
    const unsubUpdate = subscribeToMore<
      OrderUpdatedSubscription,
      OrderUpdatedSubscriptionVariables
    >({
      document: OrderUpdatedDocument,
      variables: { restaurantId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;

        const updated = subscriptionData.data.orderUpdated;

        return {
          ...prev,
          getRestaurantOrders: prev.getRestaurantOrders.map((o) =>
            o.id === updated.id ? { ...o, ...updated } : o,
          ),
        };
      },
      onError: (err) => {
        console.error("[subscription:orderUpdated]", err);
        setSubError(err);
      },
    });

    // Cleanup: close WS connections on unmount or restaurantId change
    return () => {
      unsubCreate();
      unsubUpdate();
    };
  }, [restaurantId, subscribeToMore]);

  return {
    orders: (queryResult.data?.getRestaurantOrders ?? []) as Order[],
    loading: queryResult.loading,
    error: queryResult.error,
    subError,
    networkStatus: queryResult.networkStatus,
  };
}
