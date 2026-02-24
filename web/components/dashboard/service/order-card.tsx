import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  type Order,
  type Status,
  type Table,
  STATUS_BADGE_VARIANT,
  STATUS_LABELS,
  STATUS_NEXT,
  STATUS_NEXT_LABEL,
} from "./service-types";

interface OrderCardProps {
  order: Order;
  table: Table | undefined;
  onAdvance: (orderId: string, status: Status) => void;
  loading: boolean;
}

export function OrderCard({ order, table, onAdvance, loading }: OrderCardProps) {
  const status = order.status as Status;
  const nextStatus = STATUS_NEXT[status];
  const nextLabel = STATUS_NEXT_LABEL[status];

  return (
    <div className="flex flex-col gap-2 p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-0.5 min-w-0">
          <p className="font-semibold text-sm">
            Table{" "}
            <span className="text-primary">{table?.number ?? order.tableId}</span>
          </p>
          <p className="text-xs text-muted-foreground font-mono truncate">
            {order.id}
          </p>
          <p className="text-xs text-muted-foreground">
            {new Date(order.createdAt).toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </p>
        </div>
        <Badge
          variant={STATUS_BADGE_VARIANT[status] ?? "secondary"}
          className="uppercase tracking-wider text-[10px] shrink-0"
        >
          {STATUS_LABELS[status] ?? order.status}
        </Badge>
      </div>
      {nextStatus && nextLabel && (
        <Button
          size="sm"
          variant="outline"
          className="w-full h-8 text-xs font-medium"
          disabled={loading}
          onClick={() => onAdvance(order.id, nextStatus)}
        >
          {nextLabel}
        </Button>
      )}
    </div>
  );
}
