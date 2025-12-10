import { getDashboardStatus } from "@/lib/get-dashboard-status";
import { redirect } from "next/navigation";

export default async function MenuPage() {
  const status = await getDashboardStatus();

  if (!status.checks.hasMenu) {
    redirect("/app/dashboard/menu/create");
  }
  return <div>Menu</div>;
}
