import { TableList } from "@/components/dashboard/table/table-list";

export default async function TablePage({
  params,
}: {
  params: Promise<{ restaurantId: string }>;
}) {
  const { restaurantId } = await params;

  return <TableList restaurantId={restaurantId} />;
}
