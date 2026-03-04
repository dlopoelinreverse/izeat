import { useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import {
  GetTableOrdersDocument,
  OrderUpdatedDocument,
  type GetTableOrdersQuery,
  type OrderUpdatedSubscription,
  type OrderUpdatedSubscriptionVariables,
} from "@/graphql/__generated__/graphql";

export function useTableOrders(restaurantId: string, tableId: string | null) {
  const queryVars = { restaurantId, tableId: tableId ?? "" };

  const { data, subscribeToMore } = useQuery(GetTableOrdersDocument, {
    variables: queryVars,
    skip: !tableId,
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    if (!tableId) return;
    return subscribeToMore<
      OrderUpdatedSubscription,
      OrderUpdatedSubscriptionVariables
    >({
      document: OrderUpdatedDocument,
      variables: { restaurantId },
      updateQuery: (prev, { subscriptionData }) => {
        const orders = prev.getTableOrders;
        if (!subscriptionData.data || !orders) return prev as GetTableOrdersQuery;
        const updated = subscriptionData.data.orderUpdated;
        if (updated.tableId !== tableId) return prev as GetTableOrdersQuery;
        return {
          ...prev,
          getTableOrders: orders.map((o) =>
            o?.id === updated.id ? { ...o, ...updated } : o,
          ),
        } as GetTableOrdersQuery;
      },
    });
  }, [tableId, restaurantId, subscribeToMore]);

  const orders = data?.getTableOrders ?? [];
  const waiterCall =
    [...orders].reverse().find(
      (o) => o.type === "waiter_call" && o.status !== "served",
    ) ?? null;
  const foodOrder =
    [...orders].reverse().find(
      (o) => o.type !== "waiter_call" && o.status !== "payed",
    ) ?? null;

  return { waiterCall, foodOrder };
}
