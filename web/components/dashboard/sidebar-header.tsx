"use client";

import { SidebarHeader } from "@/components/ui/sidebar";
import { useOnboarding } from "@/contexts/onboarding-context";

export function SidebarHeaderComponent() {
  const { onboarding } = useOnboarding();
  const restaurantName = onboarding?.restaurantName ?? "Nom du restaurant";
  const initials = restaurantName.slice(0, 2).toUpperCase();

  return (
    <SidebarHeader className="border-b border-sidebar-border h-14">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 shrink-0 flex items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-xs">
          {initials}
        </div>
        <div className="flex flex-col gap-0 group-data-[collapsible=icon]:hidden">
          <span className="text-sm font-semibold text-sidebar-foreground leading-tight">
            {restaurantName}
          </span>
          <span className="text-xs text-muted-foreground">Restaurant</span>
        </div>
      </div>
    </SidebarHeader>
  );
}
