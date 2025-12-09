import { Sidebar } from "@/components/ui/sidebar";
import { SidebarHeaderComponent } from "./sidebar-header";
import { SidebarNavigation } from "./sidebar-navigation";
import { SidebarFooterComponent } from "./sidebar-footer";

export function DashboardSidebar() {
  return (
    <Sidebar>
      <SidebarHeaderComponent />
      <SidebarNavigation />
      <SidebarFooterComponent />
    </Sidebar>
  );
}
