import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { headers } from "next/headers";

export default async function DashboardMenuLayout({
  children,
}: // params,
{
  children: React.ReactNode;
  // params: Promise<{ restaurantId: string }>;
}) {
  // const headerList = await headers();
  // const pathname = headerList.get("x-current-path");
  // const { restaurantId } = await params;

  // const pathnames = {
  //   [`/app/dashboard/${restaurantId}/menu/create`]: "Création du menu",
  //   [`/app/dashboard/${restaurantId}/menu`]: "Menu",
  // };

  return (
    <Card className="w-full h-full">
      {/* {pathname ? (
        <CardHeader>
          <CardTitle>{pathnames[pathname as keyof typeof pathnames]}</CardTitle>
        </CardHeader>
      ) : null} */}

      <CardHeader>
        <CardTitle>Menu</CardTitle>
      </CardHeader>
      <CardContent className="w-full h-full">{children}</CardContent>
    </Card>
  );
}
