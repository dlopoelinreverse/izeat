"use client";

import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client/react";
import { toast } from "sonner";
import QRCode from "qrcode";
import {
  GetRestaurantTablesDocument,
  GetRestaurantTablesQuery,
  UpdateTableDocument,
} from "@/graphql/__generated__/graphql";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
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
import { Hash, Users, X, Download, QrCode } from "lucide-react";

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
  const [number, setNumber] = useState("");
  const [capacity, setCapacity] = useState("");
  const [status, setStatus] = useState("available");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [generatingQr, setGeneratingQr] = useState(false);

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

  // Sync form state when table changes
  useEffect(() => {
    if (table) {
      setNumber(String(table.number));
      setCapacity(String(table.capacity));
      setStatus(table.status);
      setQrDataUrl(table.qrCode ?? null);
    }
  }, [table]);

  // Generate QR code if not yet stored
  useEffect(() => {
    if (!table || qrDataUrl) return;

    const url = `${window.location.origin}/menu/${restaurantId}?table=${table.id}`;
    setGeneratingQr(true);

    QRCode.toDataURL(url, { width: 256, margin: 2 })
      .then((dataUrl) => {
        setQrDataUrl(dataUrl);
        // Persist to DB
        updateTable({
          variables: { input: { id: table.id, qrCode: dataUrl } },
        });
      })
      .catch(() => {
        toast.error("Impossible de générer le QR code");
      })
      .finally(() => setGeneratingQr(false));
  }, [table, qrDataUrl, restaurantId, updateTable]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!table) return;

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
    if (!qrDataUrl || !table) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `table-${table.number}.png`;
    a.click();
  };

  const menuUrl = table
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/menu/${restaurantId}?table=${table.id}`
    : "";

  return (
    <Drawer open={!!table} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="max-h-[96vh]">
        <div className="mx-auto w-full max-w-md flex flex-col h-full overflow-hidden">
          <DrawerHeader className="relative border-b pb-4">
            <div className="flex items-center justify-between">
              <div>
                <DrawerTitle className="text-xl font-bold">
                  Table {table?.number}
                </DrawerTitle>
                <DrawerDescription className="text-muted-foreground mt-1">
                  Modifiez les informations de la table.
                </DrawerDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-8 w-8"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DrawerHeader>

          <div className="flex flex-col flex-1 overflow-y-auto p-6 space-y-6">
            {/* Editable fields */}
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

            {/* QR Code section */}
            <div className="border-t pt-6 space-y-3">
              <div className="flex items-center gap-2">
                <QrCode className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">QR Code de la table</span>
              </div>

              <div className="flex flex-col items-center gap-3">
                {generatingQr && (
                  <div className="h-[180px] w-[180px] flex items-center justify-center rounded-lg border border-dashed text-muted-foreground text-sm">
                    Génération...
                  </div>
                )}
                {qrDataUrl && !generatingQr && (
                  <img
                    src={qrDataUrl}
                    alt={`QR Code Table ${table?.number}`}
                    className="h-[180px] w-[180px] rounded-lg border p-1"
                  />
                )}
                <p className="text-[10px] text-muted-foreground text-center break-all px-2">
                  {menuUrl}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={handleDownloadQr}
                  disabled={!qrDataUrl}
                >
                  <Download className="h-4 w-4" />
                  Télécharger le QR code
                </Button>
              </div>
            </div>
          </div>

          <DrawerFooter className="px-6 pt-4 gap-3 flex-row border-t">
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
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
