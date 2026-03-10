import { SubscriptionGuard } from "@/components/dashboard/subscription-guard";

export default function RestaurantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SubscriptionGuard>{children}</SubscriptionGuard>;
}
