"use client";

import { ReactNode } from "react";
import { FlaskConical } from "lucide-react";
import { SidebarTrigger } from "../ui/sidebar";
import { BackButton } from "../back-button";
import { useOnboarding } from "@/contexts/onboarding-context";
import clsx from "clsx";

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
  const { isDemo } = useOnboarding();

  return (
    <div className="flex flex-col h-svh overflow-hidden relative">
      {isDemo && (
        <div className="w-full bg-orange-50 dark:bg-orange-950/30 border-b border-orange-200 dark:border-orange-800 px-4 py-2 flex items-center justify-center gap-2 text-sm text-orange-700 dark:text-orange-400">
          <FlaskConical className="h-4 w-4 shrink-0" />
          Mode démo — données fictives · environnement isolé · aucune donnée réelle
        </div>
      )}
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
      <main
        className={clsx(
          "mx-auto w-full max-w-[1440px] flex-1 overflow-y-auto p-2",
          hasBackButton && "mt-12",
        )}
      >
        {children}
      </main>
    </div>
  );
}
