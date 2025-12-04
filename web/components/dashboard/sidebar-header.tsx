"use client";

import { Store } from "lucide-react";
import { SidebarHeader } from "@/components/ui/sidebar";

interface SidebarHeaderComponentProps {
  restaurantName?: string;
}

export function SidebarHeaderComponent({
  restaurantName = "Mon Restaurant",
}: SidebarHeaderComponentProps) {
  return (
    <SidebarHeader className="border-b border-sidebar-border">
      <div className="flex items-center gap-3 px-2 py-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Store className="size-5" />
        </div>
        <div className="flex flex-col gap-0.5 group-data-[collapsible=icon]:hidden">
          <span className="text-sm font-semibold text-sidebar-foreground">
            {restaurantName}
          </span>
          <span className="text-xs text-sidebar-foreground/70">Dashboard</span>
        </div>
      </div>
    </SidebarHeader>
  );
}
