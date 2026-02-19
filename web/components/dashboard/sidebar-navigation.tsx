"use client";

import {
  Store,
  BookOpenText,
  Tag,
  UtensilsCrossed,
  ForkKnife,
  HandPlatterIcon,
} from "lucide-react";
import { SidebarContent } from "@/components/ui/sidebar";
import { useOnboarding } from "@/contexts/onboarding-context";
import { SidebarNavigationItem } from "./sidebar-navigation-item";

export function SidebarNavigation() {
  const { onboarding, loading } = useOnboarding();
  const rid = onboarding?.restaurantId ?? "";
  const off = loading || !onboarding;

  const items = [
    {
      title: "Restaurant",
      icon: Store,
      href: `/app/dashboard`,
      disabled: false,
    },
    {
      title: "Menus",
      icon: BookOpenText,
      href: `/app/dashboard/${rid}/menus`,
      disabled: off || !onboarding?.hasRestaurant,
    },
    {
      title: "Catégories",
      icon: Tag,
      href: `/app/dashboard/${rid}/menus`,
      disabled: off || !onboarding?.hasMenu,
    },
    {
      title: "Plats",
      icon: UtensilsCrossed,
      href: `/app/dashboard/${rid}/menus`,
      disabled: off || !onboarding?.hasCategory,
    },
    {
      title: "Tables",
      icon: ForkKnife,
      href: `/app/dashboard/${rid}/tables`,
      disabled: off || !onboarding?.hasDish,
    },
    {
      title: "Service",
      icon: HandPlatterIcon,
      href: `/app/dashboard/${rid}/service`,
      disabled: off || !onboarding?.isReady,
    },
  ];

  return (
    <SidebarContent className="flex flex-col gap-2 mt-5">
      {items.map((item) => (
        <SidebarNavigationItem
          key={item.title}
          item={item}
          disabled={item.disabled}
        />
      ))}
    </SidebarContent>
  );
}
