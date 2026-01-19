import {
  HandPlatterIcon,
  BookOpenText,
  ForkKnife,
  LucideShoppingBasket,
} from "lucide-react";
import { SidebarContent } from "@/components/ui/sidebar";
import { getDashboardStatus } from "@/lib/get-dashboard-status";
import { SidebarNavigationItem } from "./sidebar-navigation-item";

interface NavItem {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  items?: {
    title: string;
    href: string;
  }[];
}

export async function SidebarNavigation() {
  const status = await getDashboardStatus();

  const sidebarNavigation: NavItem[] = [
    {
      title: "Service",
      icon: HandPlatterIcon,
      href: `/app/dashboard/${status.restaurantId}/service`,
    },
    {
      title: "Menu",
      icon: BookOpenText,
      href: `/app/dashboard/${status.restaurantId}/menu`,
    },
    {
      title: "Tables",
      icon: ForkKnife,
      href: `/app/dashboard/${status.restaurantId}/tables`,
    },
    {
      title: "Ingredients",
      icon: LucideShoppingBasket,
      href: `/app/dashboard/${status.restaurantId}/ingredients`,
    },
  ];

  return (
    <SidebarContent className="flex flex-col gap-2 mt-5">
      <SidebarNavigationItem
        item={sidebarNavigation[0]}
        disabled={status.step !== "READY" || !status.checks.isServiceReady}
      />
      <SidebarNavigationItem
        item={sidebarNavigation[1]}
        disabled={status.step !== "READY" || !status.checks.hasMenu}
      />
      <SidebarNavigationItem
        item={sidebarNavigation[2]}
        disabled={status.step !== "READY" || !status.checks.hasTable}
      />
      <SidebarNavigationItem
        item={sidebarNavigation[3]}
        disabled={status.step !== "READY" || !status.checks.hasMenu}
      />
    </SidebarContent>
  );
}
