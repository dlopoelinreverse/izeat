"use client";

import {
  HandPlatterIcon,
  BookOpenText,
  ForkKnife,
  LucideShoppingBasket,
} from "lucide-react";
import { SidebarContent } from "@/components/ui/sidebar";
import { useDashboardStatus } from "@/hooks/use-dashboard-status";
import { SidebarNavigationItem } from "./sidebar-navigation-item";

export function SidebarNavigation() {
  const { status, loading } = useDashboardStatus();

  const restaurantId = status?.restaurantId ?? "";
  const allDisabled = loading || !status?.hasRestaurant;

  const sidebarNavigation = [
    {
      title: "Service",
      icon: HandPlatterIcon,
      href: `/app/dashboard/${restaurantId}/service`,
    },
    {
      title: "Menus",
      icon: BookOpenText,
      href: `/app/dashboard/${restaurantId}/menus`,
    },
    {
      title: "Tables",
      icon: ForkKnife,
      href: `/app/dashboard/${restaurantId}/tables`,
    },
    {
      title: "Ingredients",
      icon: LucideShoppingBasket,
      href: `/app/dashboard/${restaurantId}/ingredients`,
    },
  ];

  return (
    <SidebarContent className="flex flex-col gap-2 mt-5">
      <SidebarNavigationItem
        item={sidebarNavigation[0]}
        disabled={allDisabled || !status?.isFullySetup}
      />
      <SidebarNavigationItem
        item={sidebarNavigation[1]}
        disabled={allDisabled || !status?.hasMenu}
      />
      <SidebarNavigationItem
        item={sidebarNavigation[2]}
        disabled={allDisabled || !status?.hasMenu}
      />
      <SidebarNavigationItem
        item={sidebarNavigation[3]}
        disabled={allDisabled || !status?.hasMenu}
      />
    </SidebarContent>
  );
}
