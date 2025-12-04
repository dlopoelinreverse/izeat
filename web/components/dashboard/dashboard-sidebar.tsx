import { Sidebar } from "@/components/ui/sidebar";
import { SidebarHeaderComponent } from "./sidebar-header";
import { SidebarNavigation } from "./sidebar-navigation";
import { SidebarFooterComponent } from "./sidebar-footer";

interface DashboardSidebarProps {
  restaurantName?: string;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export function DashboardSidebar({
  restaurantName,
  user,
}: DashboardSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeaderComponent restaurantName={restaurantName} />
      <SidebarNavigation />
      <SidebarFooterComponent user={user} />
    </Sidebar>
  );
}
