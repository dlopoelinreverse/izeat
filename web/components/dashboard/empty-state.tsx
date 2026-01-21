import { LucideIcon, LayoutGrid } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState = ({
  icon: Icon = LayoutGrid,
  title,
  description,
  action,
}: EmptyStateProps) => {
  return (
    <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed rounded-xl border-muted bg-muted/30">
      <div className="h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center mb-4">
        <Icon className="h-10 w-10 text-muted-foreground/40" />
      </div>
      <h3 className="text-xl font-semibold text-foreground">{title}</h3>
      <p className="text-muted-foreground max-w-sm text-center mt-2 px-6">
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};
