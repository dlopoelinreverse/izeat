"use client";

import { LogOut, User, ChevronsUpDown, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client/react";
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { signOut } from "@/lib/auth-client";
import client from "@/lib/apollo-client";
import { AUTH_URL } from "@/lib/domains";
import { useOnboarding } from "@/contexts/onboarding-context";
import { CreateCustomerPortalSessionDocument } from "@/graphql/__generated__/graphql";

export function SidebarFooterComponent() {
  const router = useRouter();
  const { user, hasActiveSubscription } = useOnboarding();
  const [createPortalSession] = useMutation(
    CreateCustomerPortalSessionDocument,
  );

  const displayName = user?.name || "Utilisateur";
  const displayEmail = user?.email || "";
  const avatarImage = user?.image || undefined;

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = async () => {
    await client.clearStore();
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = `${AUTH_URL}/sign-in`;
        },
      },
    });
  };

  const handleProfile = () => {
    router.push("/dashboard/profile");
  };

  const handleSubscription = async () => {
    if (hasActiveSubscription) {
      try {
        const { data } = await createPortalSession();
        if (data?.createCustomerPortalSession.url) {
          window.location.href = data.createCustomerPortalSession.url;
        }
      } catch {
        router.push("/subscription");
      }
    } else {
      router.push("/subscription");
    }
  };

  return (
    <SidebarFooter className="border-t border-sidebar-border">
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="size-8 rounded-lg">
                  <AvatarImage src={avatarImage} alt={displayName} />
                  <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{displayName}</span>
                  <span className="truncate text-xs text-sidebar-foreground/70">
                    {displayEmail}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-xl shadow-lg"
              side="top"
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="size-8 rounded-lg">
                    <AvatarImage src={avatarImage} alt={displayName} />
                    <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {displayName}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {displayEmail}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleProfile}
                className="cursor-pointer"
              >
                <User className="mr-2 size-4" />
                Mon profil
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleSubscription}
                className="cursor-pointer"
              >
                <CreditCard className="mr-2 size-4" />
                Mon abonnement
                <Badge
                  variant={hasActiveSubscription ? "default" : "secondary"}
                  className="ml-auto text-[10px] px-1.5 py-0"
                >
                  {hasActiveSubscription ? "Actif" : "Gratuit"}
                </Badge>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 size-4" />
                Se déconnecter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}
