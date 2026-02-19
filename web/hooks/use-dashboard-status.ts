"use client";

import { useQuery } from "@apollo/client";
import { GetDashboardSetupStatusDocument } from "@/graphql/__generated__/graphql";

export function useDashboardStatus() {
  const { data, loading, error } = useQuery(GetDashboardSetupStatusDocument, {
    fetchPolicy: "cache-and-network",
  });

  return {
    status: data?.dashboardSetupStatus ?? null,
    loading,
    error,
  };
}
