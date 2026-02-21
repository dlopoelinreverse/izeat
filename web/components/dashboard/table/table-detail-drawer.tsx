"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { toast } from "sonner";
import {
  GetRestaurantTablesDocument,
  GetRestaurantTablesQuery,
  UpdateTableDocument,
} from "@/graphql/__generated__/graphql";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Hash, Users, Download, QrCode, ExternalLink } from "lucide-react";

type Table = GetRestaurantTablesQuery["getRestaurantTables"][number];

interface TableDetailDrawerProps {
  table: Table | null;
  restaurantId: string;
  onClose: () => void;
}

export const TableDetailDrawer = ({
  table,
  restaurantId,
  onClose,
}: TableDetailDrawerProps) => {
  return (
    <Sheet open={!!table} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="flex flex-col gap-0 p-0 sm:max-w-md overflow-hidden">
        {table && (
          <TableDetailForm
            key={table.id}
            table={table}
            restaurantId={restaurantId}
            onClose={onClose}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};

interface TableDetailFormProps {
  table: Table;
  restaurantId: string;
  onClose: () => void;
}

const TableDetailForm = ({
  table,
  restaurantId,
  onClose,
}: TableDetailFormProps) => {
  const [number, setNumber] = useState(String(table.number));
  const [capacity, setCapacity] = useState(String(table.capacity));
  const [status, setStatus] = useState(table.status);

  const [updateTable, { loading }] = useMutation(UpdateTableDocument, {
    onError: (error) => {
      toast.error(error.message || "Erreur lors de la mise à jour");
    },
    update: (cache, { data }) => {
      const existing = cache.readQuery<GetRestaurantTablesQuery>({
        query: GetRestaurantTablesDocument,
        variables: { restaurantId },
      });
      if (existing && data?.updateTable) {
        cache.writeQuery({
          query: GetRestaurantTablesDocument,
          variables: { restaurantId },
          data: {
            getRestaurantTables: existing.getRestaurantTables.map((t) =>
              t.id === data.updateTable.id ? data.updateTable : t,
            ),
          },
        });
      }
    },
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateTable({
      variables: {
        input: {
          id: table.id,
          number: parseInt(number),
          capacity: parseInt(capacity),
          status,
        },
      },
      onCompleted: () => toast.success("Table mise à jour"),
    });
  };

  const handleDownloadQr = () => {
    if (!table.qrCode) return;
    const a = document.createElement("a");
    a.href = table.qrCode;
    a.download = `table-${table.number}.png`;
    a.click();
  };

  const menuUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/menu/${restaurantId}?table=${table.id}`;

  return (
    <>
      <SheetHeader className="border-b px-6 py-4">
        <SheetTitle className="text-xl font-bold">
          Table {table.number}
        </SheetTitle>
        <SheetDescription>
          Modifiez les informations de la table.
        </SheetDescription>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        <form onSubmit={handleSave} className="space-y-4" id="table-form">
          <div className="space-y-2">
            <Label
              htmlFor="table-number"
              className="text-sm font-medium flex items-center gap-2"
            >
              <Hash className="h-4 w-4 text-primary" />
              Numéro de la table
            </Label>
            <Input
              id="table-number"
              type="number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="table-capacity"
              className="text-sm font-medium flex items-center gap-2"
            >
              <Users className="h-4 w-4 text-primary" />
              Capacité (personnes)
            </Label>
            <Input
              id="table-capacity"
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Statut</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Libre</SelectItem>
                <SelectItem value="occupied">Occupée</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>

        <div className="border-t pt-6 space-y-4">
          <div className="flex items-center gap-2">
            <QrCode className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">QR Code de la table</span>
          </div>

          <div className="flex flex-col items-center gap-3">
            {table.qrCode ? (
              <a
                href={menuUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block rounded-lg border p-1 hover:border-primary transition-colors"
                title="Ouvrir la page menu"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- data: URL, Next/Image ne supporte pas le base64 */}
                <img
                  src={table.qrCode}
                  alt={`QR Code Table ${table.number}`}
                  className="h-[200px] w-[200px] rounded"
                />
                <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/0 group-hover:bg-black/10 transition-colors">
                  <ExternalLink className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 drop-shadow transition-opacity" />
                </div>
              </a>
            ) : (
              <div className="h-[200px] w-[200px] flex items-center justify-center rounded-lg border border-dashed text-muted-foreground text-sm">
                QR non disponible
              </div>
            )}

            <p className="text-[10px] text-muted-foreground text-center break-all">
              {menuUrl}
            </p>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handleDownloadQr}
              disabled={!table.qrCode}
            >
              <Download className="h-4 w-4" />
              Télécharger le QR code
            </Button>
          </div>
        </div>
      </div>

      <SheetFooter className="border-t px-6 py-4 flex-row gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="flex-1 h-11"
          disabled={loading}
        >
          Annuler
        </Button>
        <Button
          type="submit"
          form="table-form"
          className="flex-1 h-11 font-semibold"
          disabled={loading}
        >
          {loading ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </SheetFooter>
    </>
  );
};
