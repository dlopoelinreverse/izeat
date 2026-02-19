import Link from "next/link";
import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";

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
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        tooltip={item.title}
        className="flex justify-between gap-2 px-6"
        disabled={disabled}
      >
        {disabled ? (
          <span aria-disabled="true" className="cursor-not-allowed opacity-50">
            <item.icon className="size-4" />
            <span>{item.title}</span>
          </span>
        ) : (
          <Link href={item.href}>
            <item.icon className="size-4" />
            <span>{item.title}</span>
          </Link>
        )}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
