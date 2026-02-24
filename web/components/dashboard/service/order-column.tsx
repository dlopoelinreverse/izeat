import { ClipboardList } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { OrderCard } from "./order-card";
import {
  type Order,
  type Status,
  type Table,
  STATUS_COLORS,
  STATUS_LABELS,
} from "./service-types";

interface OrderColumnProps {
  status: Status;
  orders: Order[];
  tables: Table[];
  onAdvance: (orderId: string, status: Status) => void;
  loading: boolean;
}

export function OrderColumn({
  status,
  orders,
  tables,
  onAdvance,
  loading,
}: OrderColumnProps) {
  const filtered = orders.filter((o) => o.status === status);

  return (
    <div
      className={`flex flex-col rounded-xl border p-3 gap-3 ${STATUS_COLORS[status]}`}
    >
      <div className="flex items-center gap-2 px-1">
        <h3 className="font-semibold text-sm">{STATUS_LABELS[status]}</h3>
        <Badge variant="secondary" className="text-xs h-5 px-1.5">
          {filtered.length}
        </Badge>
      </div>
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <ClipboardList className="h-8 w-8 text-muted-foreground/20 mb-2" />
          <p className="text-xs text-muted-foreground/60">Aucune commande</p>
        </div>
      ) : (
        filtered.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            table={tables.find((t) => t.id === order.tableId)}
            onAdvance={onAdvance}
            loading={loading}
          />
        ))
      )}
    </div>
  );
}
