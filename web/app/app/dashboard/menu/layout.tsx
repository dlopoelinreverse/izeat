import { PropsWithChildren } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { headers } from "next/headers";

const pathnames = {
  "/app/dashboard/menu/create": "Création du menu",
  "/app/dashboard/menu": "Menu",
};

export default async function DashboardMenuLayout({
  children,
}: PropsWithChildren) {
  const headerList = await headers();
  const pathname = headerList.get("x-current-path");

  return (
    <Card className="w-full h-full">
      {pathname ? (
        <CardHeader>
          <CardTitle>{pathnames[pathname as keyof typeof pathnames]}</CardTitle>
        </CardHeader>
      ) : null}
      <CardContent className="w-full h-full">{children}</CardContent>
    </Card>
  );
}
