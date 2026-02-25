import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { NetworkStatus } from "@apollo/client";
import {
  GetRestaurantOrdersDocument,
  OrderCreatedDocument,
  OrderUpdatedDocument,
  type GetRestaurantOrdersQuery,
  type GetRestaurantOrdersQueryVariables,
  type OrderCreatedSubscription,
  type OrderCreatedSubscriptionVariables,
  type OrderUpdatedSubscription,
  type OrderUpdatedSubscriptionVariables,
} from "@/graphql/__generated__/graphql";
import type { Order } from "../types/service-types";

interface UseOrdersOptions {
  onOrderCreated?: (order: Order) => void;
  onWaiterCallCreated?: (order: Order) => void;
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

  const onOrderCreatedRef = useRef(options?.onOrderCreated);
  const onWaiterCallCreatedRef = useRef(options?.onWaiterCallCreated);
  useLayoutEffect(() => {
    onOrderCreatedRef.current = options?.onOrderCreated;
    onWaiterCallCreatedRef.current = options?.onWaiterCallCreated;
  });

  const queryResult = useQuery<
    GetRestaurantOrdersQuery,
    GetRestaurantOrdersQueryVariables
  >(GetRestaurantOrdersDocument, {
    variables: { restaurantId },
    fetchPolicy: "cache-and-network",
  });

  const { subscribeToMore } = queryResult;

  useEffect(() => {
    if (!restaurantId) return;

    const unsubCreate = subscribeToMore<
      OrderCreatedSubscription,
      OrderCreatedSubscriptionVariables
    >({
      document: OrderCreatedDocument,
      variables: { restaurantId },
      updateQuery: (prev, { subscriptionData }) => {
        const orders = prev.getRestaurantOrders;
        if (!subscriptionData.data || !orders)
          return prev as GetRestaurantOrdersQuery;

        const newOrder = subscriptionData.data.orderCreated;

        if (orders.some((o) => o?.id === newOrder.id)) {
          return prev as GetRestaurantOrdersQuery;
        }

        if (newOrder.type === "waiter_call") {
          onWaiterCallCreatedRef.current?.(newOrder as Order);
        } else {
          onOrderCreatedRef.current?.(newOrder as Order);
        }

        return {
          ...prev,
          getRestaurantOrders: [newOrder, ...orders],
        } as GetRestaurantOrdersQuery;
      },
      onError: (err) => {
        console.error("[subscription:orderCreated]", err);
        setSubError(err);
      },
    });

    const unsubUpdate = subscribeToMore<
      OrderUpdatedSubscription,
      OrderUpdatedSubscriptionVariables
    >({
      document: OrderUpdatedDocument,
      variables: { restaurantId },
      updateQuery: (prev, { subscriptionData }) => {
        const orders = prev.getRestaurantOrders;
        if (!subscriptionData.data || !orders)
          return prev as GetRestaurantOrdersQuery;

        const updated = subscriptionData.data.orderUpdated;

        return {
          ...prev,
          getRestaurantOrders: orders.map((o) =>
            o?.id === updated.id ? { ...o, ...updated } : o,
          ),
        } as GetRestaurantOrdersQuery;
      },
      onError: (err) => {
        console.error("[subscription:orderUpdated]", err);
        setSubError(err);
      },
    });

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
