import type { GetRestaurantOrdersQuery } from "@/graphql/__generated__/graphql";

export type Order = GetRestaurantOrdersQuery["getRestaurantOrders"][number];

export interface Table {
  id: string;
  number: number;
  capacity: number;
}

export const STATUSES = ["pending", "preparing", "served"] as const;
export type Status = (typeof STATUSES)[number];

export const STATUS_LABELS: Record<Status, string> = {
  pending: "Attente",
  preparing: "Préparation",
  served: "Servi",
};

export const STATUS_NEXT: Record<Status, Status | null> = {
  pending: "preparing",
  preparing: "served",
  served: null,
};

export const STATUS_NEXT_LABEL: Record<Status, string | null> = {
  pending: "Envoyer en préparation",
  preparing: "Apporter à table",
  served: null,
};

export const STATUS_COLORS: Record<Status, string> = {
  pending: "bg-amber-50 border-amber-200",
  preparing: "bg-blue-50 border-blue-200",
  served: "bg-green-50 border-green-200",
};

export const STATUS_DOT_COLORS: Record<Status, string> = {
  pending: "bg-amber-500",
  preparing: "bg-blue-500",
  served: "bg-green-500",
};

export const STATUS_BADGE_VARIANT: Record<
  Status,
  "secondary" | "default" | "outline"
> = {
  pending: "secondary",
  preparing: "default",
  served: "outline",
};
