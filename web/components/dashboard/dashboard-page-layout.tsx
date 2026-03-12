"use client";

import { ReactNode } from "react";
import { FlaskConical } from "lucide-react";
import { SidebarTrigger } from "../ui/sidebar";
import { BackButton } from "../back-button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "../ui/tooltip";
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
      {hasBackButton && (
        <div className="top-16 left-2 right-0 h-14 absolute z-20">
          <BackButton />
        </div>
      )}
      <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-1 items-center gap-2 px-3 justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">{title}</h1>
            {isDemo && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 dark:bg-orange-950/50 px-2.5 py-0.5 text-xs font-medium text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800 cursor-default">
                    <FlaskConical className="h-3 w-3" />
                    Demo
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  Mode démo — données fictives · environnement isolé · aucune donnée réelle
                </TooltipContent>
              </Tooltip>
            )}
          </div>
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
