import { ServicePage } from "@/components/dashboard/service/service-page";

export default async function ServiceRoutePage({
  params,
}: {
  params: Promise<{ restaurantId: string }>;
}) {
  const { restaurantId } = await params;

  return <ServicePage restaurantId={restaurantId} />;
}
