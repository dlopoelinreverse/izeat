// import { getDashboardStatus } from "@/lib/get-dashboard-status";
// import { redirect } from "next/navigation";

export default async function MenuPage({
  params,
}: {
  params: Promise<{ restaurantId: string }>;
}) {
  // const status = await getDashboardStatus();

  // if (!status.checks.hasMenu) {
  //   redirect(`/app/dashboard/${status.restaurantId}/menu/create`);
  // }
  const { restaurantId } = await params;
  return <div>Menu {restaurantId}</div>;
}
