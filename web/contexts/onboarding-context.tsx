"use client";

import { createContext, useContext } from "react";
import { useQuery } from "@apollo/client/react";
import { MeDocument, Onboarding } from "@/graphql/__generated__/graphql";

type OnboardingContextType = {
  onboarding: Onboarding | null;
  hasActiveSubscription: boolean;
  loading: boolean;
  refetchOnboarding: () => void;
};

const OnboardingContext = createContext<OnboardingContextType>({
  onboarding: null,
  hasActiveSubscription: false,
  loading: true,
  refetchOnboarding: () => {},
});

export function OnboardingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, loading, refetch } = useQuery(MeDocument, {
    fetchPolicy: "cache-and-network",
  });

  return (
    <OnboardingContext.Provider
      value={{
        onboarding: data?.me?.onboarding ?? null,
        hasActiveSubscription: data?.me?.hasActiveSubscription ?? false,
        loading,
        refetchOnboarding: refetch,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  return useContext(OnboardingContext);
}
