"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  MySubscriptionDocument,
  VerifyCheckoutSessionDocument,
} from "@/graphql/__generated__/graphql";
import { useOnboarding } from "@/contexts/onboarding-context";

function SubscriptionSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { onboarding, refetchOnboarding } = useOnboarding();
  const pollCountRef = useRef(0);
  const verifiedRef = useRef(false);

  const [verifyCheckoutSession] = useMutation(VerifyCheckoutSessionDocument);

  const { data, startPolling, stopPolling } = useQuery(MySubscriptionDocument, {
    fetchPolicy: "network-only",
  });

  // On mount: verify the session directly via Stripe API (no webhook dependency)
  useEffect(() => {
    if (!sessionId || verifiedRef.current) return;
    verifiedRef.current = true;

    verifyCheckoutSession({ variables: { sessionId } }).catch((err) =>
      console.error("Verification error:", err),
    );
  }, [sessionId, verifyCheckoutSession]);

  // Poll until status is confirmed active
  useEffect(() => {
    startPolling(2000);
    return () => stopPolling();
  }, [startPolling, stopPolling]);

  useEffect(() => {
    const status = data?.mySubscription?.status;

    if (status === "active" || status === "trialing") {
      stopPolling();
      refetchOnboarding();

      const restaurantId = onboarding?.restaurantId;
      if (restaurantId) {
        router.push(`/dashboard/${restaurantId}/menus`);
      } else {
        router.push("/dashboard");
      }
      return;
    }

    pollCountRef.current += 1;
    if (pollCountRef.current > 20) {
      stopPolling();
      router.push("/dashboard");
    }
  }, [data, onboarding, refetchOnboarding, router, stopPolling]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-6">
        {/* Success icon */}
        <div className="w-20 h-20 bg-linear-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-orange-500/30">
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <div>
          <h1 className="text-3xl font-extrabold bg-linear-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            Paiement confirmé !
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Activation de votre abonnement en cours...
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
          <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          Redirection automatique...
        </div>
      </div>
    </div>
  );
}

export default function SubscriptionSuccessPage() {
  return (
    <Suspense>
      <SubscriptionSuccessContent />
    </Suspense>
  );
}
