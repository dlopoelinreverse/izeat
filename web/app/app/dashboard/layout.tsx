import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: Récupérer les données du restaurant et de l'utilisateur depuis votre API/session
  const restaurantData = {
    name: "Le Gourmet",
  };

  const userData = {
    name: "Jean Dupont",
    email: "jean.dupont@example.com",
    avatar: undefined, // Optionnel: URL de l'avatar
  };

  return (
    <SidebarProvider>
      <DashboardSidebar restaurantName={restaurantData.name} user={userData} />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex flex-1 items-center gap-2 px-3">
            <h1 className="text-lg font-semibold">Dashboard</h1>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6 lg:gap-8 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
