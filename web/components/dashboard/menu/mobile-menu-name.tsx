"use client";

import { useState, useRef } from "react";
import { Pencil } from "lucide-react";
import { useMutation } from "@apollo/client/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  RenameMenuDocument,
  GetMenusDocument,
  GetMenusQuery,
} from "@/graphql/__generated__/graphql";

interface MobileMenuNameProps {
  menuId: string;
  menuName: string;
  restaurantId: string;
}

export function MobileMenuName({ menuId, menuName, restaurantId }: MobileMenuNameProps) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [renameMenu, { loading }] = useMutation(RenameMenuDocument, {
    onCompleted: () => {
      toast.success("Menu renommé");
      setOpen(false);
    },
    onError: (err) => {
      toast.error(err.message || "Erreur lors du renommage");
    },
    update(cache, { data }) {
      if (!data?.renameMenu) return;
      const existing = cache.readQuery<GetMenusQuery>({
        query: GetMenusDocument,
        variables: { restaurantId },
      });
      if (!existing) return;
      cache.writeQuery({
        query: GetMenusDocument,
        variables: { restaurantId },
        data: {
          getMenus: existing.getMenus.map((m) =>
            m.id === menuId ? { ...m, name: data.renameMenu.name } : m
          ),
        },
      });
    },
  });

  const handleSave = () => {
    const value = inputRef.current?.value ?? "";
    if (!value.trim()) return;
    renameMenu({ variables: { menuId, name: value.trim() } });
  };

  return (
    <>
      <div className="flex items-center gap-1.5 flex-1 min-w-0">
        <span className="text-lg font-semibold truncate">{menuName}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 shrink-0 text-muted-foreground"
          onClick={() => setOpen(true)}
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[380px]">
          <DialogHeader>
            <DialogTitle>Renommer le menu</DialogTitle>
          </DialogHeader>
          <Input
            ref={inputRef}
            defaultValue={menuName}
            placeholder="Nom du menu"
            autoFocus
            className="h-11"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") setOpen(false);
            }}
          />
          <DialogFooter className="gap-2 flex-row">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
              disabled={loading}
            >
              Annuler
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1"
              disabled={loading}
            >
              {loading ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
