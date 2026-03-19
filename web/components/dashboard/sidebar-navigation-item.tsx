"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarMenuButton, SidebarMenuItem, useSidebar } from "../ui/sidebar";

export const SidebarNavigationItem = ({
  item,
  disabled,
}: {
  item: {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    href: string;
  };
  disabled?: boolean;
}) => {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();
  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

  const handleClick = () => {
    if (isMobile) setOpenMobile(false);
  };

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        tooltip={item.title}
        isActive={isActive}
        disabled={disabled}
        className={[
          "flex items-center gap-2 px-3 py-2 rounded-lg text-sm border transition-colors",
          isActive
            ? "bg-accent border-border font-semibold text-foreground"
            : "border-transparent hover:bg-accent hover:text-foreground",
          disabled ? "opacity-50 cursor-not-allowed" : "",
        ].join(" ")}
      >
        {disabled ? (
          <span aria-disabled="true">
            <item.icon className="size-4 text-muted-foreground" />
            <span>{item.title}</span>
          </span>
        ) : (
          <Link href={item.href} onClick={handleClick}>
            <item.icon
              className={`size-4 ${isActive ? "text-foreground" : "text-muted-foreground"}`}
            />
            <span>{item.title}</span>
            {isActive && (
              <span className="w-1.5 h-1.5 rounded-full bg-primary ml-auto shrink-0" />
            )}
          </Link>
        )}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
