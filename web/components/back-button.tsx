"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";

export const BackButton = () => {
  const router = useRouter();
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 shrink-0"
      onClick={() => router.back()}
    >
      <ArrowLeft className="h-4 w-4" />
    </Button>
  );
};
