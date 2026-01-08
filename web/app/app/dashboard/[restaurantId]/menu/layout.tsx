import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardMenuLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ restaurantId: string }>;
}) {
  const { restaurantId } = await params;

  return (
    <Card className="w-full h-full">
      <CardContent className="w-full h-full">{children}</CardContent>
    </Card>
  );
}
