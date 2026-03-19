"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Pencil, X } from "lucide-react";
import { useMutation } from "@apollo/client/react";
import { toast } from "sonner";
import {
  RenameMenuDocument,
  GetMenusDocument,
  GetMenusQuery,
} from "@/graphql/__generated__/graphql";

interface MenuNameProps {
  menuId: string;
  restaurantId: string;
  menuName: string;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
}

export const MenuName = ({
  menuId,
  restaurantId,
  menuName,
  isEditing,
  setIsEditing,
}: MenuNameProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [renameMenu, { loading }] = useMutation(RenameMenuDocument, {
    onCompleted: () => {
      toast.success("Menu renommé");
      setIsEditing(false);
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

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-bold text-foreground truncate">{menuName}</h1>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 shrink-0 text-muted-foreground"
          onClick={() => setIsEditing(true)}
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 flex-1">
      <Input
        ref={inputRef}
        placeholder="Nom du menu"
        defaultValue={menuName}
        autoFocus
        className="h-8 text-sm"
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSave();
          if (e.key === "Escape") handleCancel();
        }}
      />
      <Button
        variant="default"
        size="icon"
        className="h-8 w-8 shrink-0"
        disabled={loading}
        onClick={handleSave}
      >
        <Check className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 shrink-0"
        disabled={loading}
        onClick={handleCancel}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};
