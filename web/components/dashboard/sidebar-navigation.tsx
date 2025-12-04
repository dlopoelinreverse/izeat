// "use client";

import Link from "next/link";
import {
  ChevronDown,
  LayoutDashboard,
  UtensilsCrossed,
  Users,
  Settings,
  BarChart3,
  ShoppingBag,
  ClipboardList,
  Table2,
  HandPlatterIcon,
  BookOpenText,
  ForkKnife,
} from "lucide-react";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface NavItem {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  items?: {
    title: string;
    href: string;
  }[];
}

const sidebarNavigation: NavItem[] = [
  {
    title: "Service",
    icon: HandPlatterIcon,
    href: "/app/dashboard/service",
  },
  {
    title: "Menu",
    icon: BookOpenText,
    href: "/app/dashboard/menu",
  },
  {
    title: "Tables",
    icon: ForkKnife,
    href: "/app/dashboard/tables",
  },
];

// const navigationGroups: {
//   label: string;
//   items: NavItem[];
// }[] = [
//   {
//     label: "Service",
//     items: [
//       {
//         title: "Tableau de bord",
//         icon: LayoutDashboard,
//         href: "/app/dashboard",
//       },
//       {
//         title: "Commandes",
//         icon: ShoppingBag,
//         items: [
//           { title: "En cours", href: "/app/dashboard/orders/active" },
//           { title: "Historique", href: "/app/dashboard/orders/history" },
//           { title: "Statistiques", href: "/app/dashboard/orders/stats" },
//         ],
//       },
//       {
//         title: "Tables",
//         icon: Table2,
//         items: [
//           { title: "Vue d'ensemble", href: "/app/dashboard/tables/overview" },
//           { title: "Réservations", href: "/app/dashboard/tables/reservations" },
//           { title: "Configuration", href: "/app/dashboard/tables/config" },
//         ],
//       },
//     ],
//   },
//   {
//     label: "Menu & Produits",
//     items: [
//       {
//         title: "Menu",
//         icon: UtensilsCrossed,
//         items: [
//           { title: "Plats", href: "/app/dashboard/menu/dishes" },
//           { title: "Catégories", href: "/app/dashboard/menu/categories" },
//           { title: "Disponibilité", href: "/app/dashboard/menu/availability" },
//         ],
//       },
//       {
//         title: "Inventaire",
//         icon: ClipboardList,
//         items: [
//           { title: "Stock", href: "/app/dashboard/inventory/stock" },
//           { title: "Fournisseurs", href: "/app/dashboard/inventory/suppliers" },
//           { title: "Alertes", href: "/app/dashboard/inventory/alerts" },
//         ],
//       },
//     ],
//   },
//   {
//     label: "Administration",
//     items: [
//       {
//         title: "Personnel",
//         icon: Users,
//         items: [
//           { title: "Équipe", href: "/app/dashboard/staff/team" },
//           { title: "Plannings", href: "/app/dashboard/staff/schedules" },
//           { title: "Rôles", href: "/app/dashboard/staff/roles" },
//         ],
//       },
//       {
//         title: "Rapports",
//         icon: BarChart3,
//         items: [
//           { title: "Ventes", href: "/app/dashboard/reports/sales" },
//           { title: "Performance", href: "/app/dashboard/reports/performance" },
//           { title: "Clients", href: "/app/dashboard/reports/customers" },
//         ],
//       },
//       {
//         title: "Paramètres",
//         icon: Settings,
//         href: "/app/dashboard/settings",
//       },
//     ],
//   },
// ];

export function SidebarNavigation() {
  return (
    <SidebarContent className="flex flex-col gap-2 mt-5">
      {sidebarNavigation.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild tooltip={item.title}>
            <Link href={item.href}>
              <item.icon className="size-4" />
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
      {/* {navigationGroups.map((group) => (
        <Collapsible
          key={group.label}
          defaultOpen
          className="group/collapsible"
        >
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="w-full">
                {group.label}
                <ChevronDown className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => {
                    const isActive = item.href
                      ? pathname === item.href
                      : item.items?.some(
                          (subItem) => pathname === subItem.href
                        );

                    if (item.items) {
                      return (
                        <Collapsible
                          key={item.title}
                          defaultOpen={isActive}
                          className="group/menu-collapsible"
                        >
                          <SidebarMenuItem>
                            <SidebarMenuButton
                              asChild
                              tooltip={item.title}
                              isActive={isActive}
                            >
                              <CollapsibleTrigger>
                                <item.icon className="size-4" />
                                <span>{item.title}</span>
                                <ChevronDown className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/menu-collapsible:rotate-180" />
                              </CollapsibleTrigger>
                            </SidebarMenuButton>
                            <CollapsibleContent>
                              <SidebarMenuSub>
                                {item.items.map((subItem) => (
                                  <SidebarMenuSubItem key={subItem.href}>
                                    <SidebarMenuSubButton
                                      asChild
                                      isActive={pathname === subItem.href}
                                    >
                                      <Link href={subItem.href}>
                                        <span>{subItem.title}</span>
                                      </Link>
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                                ))}
                              </SidebarMenuSub>
                            </CollapsibleContent>
                          </SidebarMenuItem>
                        </Collapsible>
                      );
                    }

                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          tooltip={item.title}
                          isActive={isActive}
                        >
                          <Link href={item.href!}>
                            <item.icon className="size-4" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      ))} */}
    </SidebarContent>
  );
}
