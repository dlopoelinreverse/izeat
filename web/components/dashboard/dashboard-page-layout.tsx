import { ReactNode } from "react";
import { SidebarTrigger } from "../ui/sidebar";
import { BackButton } from "../back-button";

export default function DashboardPageLayout({
  children,
  title,
  headerAction,
  hasBackButton,
}: {
  children: ReactNode;
  title?: string;
  headerAction?: ReactNode;
  hasBackButton?: boolean;
}) {
  return (
    <div className="flex flex-col h-screen relative">
      {hasBackButton && (
        <div className="top-16 left-2 right-0 h-14 absolute z-20">
          <BackButton />
        </div>
      )}
      <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-1 items-center gap-2 px-3 justify-between">
          <h1 className="text-lg font-semibold">{title}</h1>
          {headerAction}
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6 lg:gap-8 lg:p-8">
        <div className="mx-auto w-full max-w-[1440px] h-full">{children}</div>
      </main>
    </div>
  );
}
