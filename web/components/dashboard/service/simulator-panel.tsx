import { SendHorizonal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Table } from "./service-types";

interface SimulatorPanelProps {
  tables: Table[];
  tableId: string;
  onTableChange: (id: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

export function SimulatorPanel({
  tables,
  tableId,
  onTableChange,
  onSubmit,
  loading,
}: SimulatorPanelProps) {
  return (
    <Card>
      <CardHeader className="border-b pb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <SendHorizonal className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Simulateur client</CardTitle>
            <CardDescription className="mt-1">
              Simulez une commande envoyée depuis une table
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col sm:flex-row gap-4 pt-6">
        <form
          id="order-form"
          onSubmit={onSubmit}
          className="flex-1 space-y-2"
        >
          <Label htmlFor="table-select" className="text-sm font-medium">
            Table
          </Label>
          <Select value={tableId} onValueChange={onTableChange}>
            <SelectTrigger id="table-select" className="h-11">
              <SelectValue placeholder="Sélectionner une table…" />
            </SelectTrigger>
            <SelectContent>
              {tables.map((table) => (
                <SelectItem key={table.id} value={table.id}>
                  Table {table.number}{" "}
                  <span className="text-muted-foreground text-xs ml-1">
                    ({table.capacity} pers.)
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </form>
        <Button
          form="order-form"
          type="submit"
          className="h-11 font-semibold sm:self-end sm:min-w-[200px]"
          disabled={loading || !tableId}
        >
          {loading ? "Envoi en cours…" : "Passer une commande test"}
        </Button>
      </CardContent>
    </Card>
  );
}
