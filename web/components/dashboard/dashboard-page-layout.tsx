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
      <header className="sticky top-0 z-10 shrink-0 bg-background border-b">
        <div className="flex h-14 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />

          {hasBackButton && (
            <BackButton />
          )}

          {title && (
            <h1 className="text-lg font-semibold flex-1 truncate">{title}</h1>
          )}

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

          {/* Desktop : action inline à droite du titre */}
          {headerAction && (
            <div className="hidden md:flex items-center gap-2 shrink-0 ml-auto">
              {headerAction}
            </div>
          )}
        </div>

        {/* Mobile : action en sub-header pleine largeur */}
        {headerAction && (
          <div className="md:hidden px-4 py-2.5 bg-muted/50 border-t [&>*]:w-full [&_button]:w-full">
            {headerAction}
          </div>
        )}
      </header>

      <main className="mx-auto w-full max-w-[1440px] flex-1 overflow-y-auto p-2">
        {children}
      </main>
    </div>
  );
}
