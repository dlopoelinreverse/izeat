import { ReactNode } from "react";
import { SidebarTrigger } from "../ui/sidebar";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";

export default function DashboardPageLayout({
  children,
  title,
  headerAction,
}: {
  children: ReactNode;
  title: string;
  headerAction: ReactNode;
}) {
  return (
    <>
      <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-1 items-center gap-2 px-3">
          <h1 className="text-lg font-semibold">{title}</h1>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6 lg:gap-8 lg:p-8">
        <div className="mx-auto w-full max-w-[1440px] h-full">
          <Card className="h-full">
            <CardHeader className="h-10">{headerAction}</CardHeader>
            <CardContent className="h-full">{children}</CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
