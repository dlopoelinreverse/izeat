import { ClipboardList } from "lucide-react";
import { OrderCard } from "./order-card";
import {
  type Order,
  type Status,
  type Table,
  STATUS_COLORS,
  STATUS_DOT_COLORS,
  STATUS_LABELS,
} from "../../../types/service-types";

interface OrderColumnProps {
  status: Status;
  orders: Order[];
  tables: Table[];
  onAdvance: (orderId: string, status: Status) => void;
  onPay: (orderId: string) => void;
  loading: boolean;
}

export function OrderColumn({
  status,
  orders,
  tables,
  onAdvance,
  onPay,
  loading,
}: OrderColumnProps) {
  const filtered = orders.filter((o) => o.status === status);

  return (
    <div
      className={`flex flex-col rounded-xl border p-3 gap-3 ${STATUS_COLORS[status]}`}
    >
      <div className="flex items-center gap-2 px-1 mb-1">
        <span className={`w-2 h-2 rounded-full shrink-0 ${STATUS_DOT_COLORS[status]}`} />
        <h3 className="text-sm font-semibold text-foreground">{STATUS_LABELS[status]}</h3>
        <span className="ml-auto text-xs font-medium text-muted-foreground bg-background/70 px-1.5 py-0.5 rounded-md border">
          {filtered.length}
        </span>
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
            onPay={onPay}
            loading={loading}
          />
        ))
      )}
    </div>
  );
}
