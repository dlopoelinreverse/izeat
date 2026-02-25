"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface MenuBackButtonProps {
  restaurantId: string;
}

export function MenuBackButton({ restaurantId }: MenuBackButtonProps) {
  const searchParams = useSearchParams();
  const table = searchParams.get("table");
  const cart = searchParams.get("cart");

  const backParams = new URLSearchParams();
  if (table) backParams.set("table", table);
  if (cart) backParams.set("cart", cart);
  const backQuery = backParams.toString();
  const backHref = `/menu/${restaurantId}${backQuery ? `?${backQuery}` : ""}`;

  return (
    <Link
      href={backHref}
      className="flex items-center justify-center size-8 rounded-md hover:bg-accent transition-colors"
      aria-label="Retour"
    >
      <ArrowLeft className="h-4 w-4" />
    </Link>
  );
}
