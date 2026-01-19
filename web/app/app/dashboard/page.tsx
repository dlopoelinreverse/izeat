import { CreateRestaurantForm } from "@/components/dashboard/restaurant/create-restaurant-form";
import { getDashboardStatus } from "@/lib/get-dashboard-status";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const status = await getDashboardStatus();

  const { step, restaurantId, checks } = status;

  if (step === "NO_RESTAURANT") {
    return <CreateRestaurantForm />;
  }

  if (!checks.hasMenu) {
    redirect(`/app/dashboard/${restaurantId}/menus`);
  }

  if (!checks.hasTable) {
    redirect(`/app/dashboard/${restaurantId}/tables`);
  }

  if (checks.isServiceReady) {
    redirect(`/app/dashboard/${restaurantId}/service`);
  }
}
