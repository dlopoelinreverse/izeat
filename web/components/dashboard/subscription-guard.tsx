"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "@/contexts/onboarding-context";

export function SubscriptionGuard({ children }: { children: React.ReactNode }) {
  const { hasActiveSubscription, loading } = useOnboarding();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !hasActiveSubscription) {
      router.push("/subscription");
    }
  }, [loading, hasActiveSubscription, router]);

  if (!hasActiveSubscription) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
