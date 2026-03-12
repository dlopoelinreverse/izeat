"use client";

import { createContext, useContext } from "react";
import { useQuery } from "@apollo/client/react";
import { MeDocument, Onboarding } from "@/graphql/__generated__/graphql";

type UserProfile = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
};

type OnboardingContextType = {
  onboarding: Onboarding | null;
  hasActiveSubscription: boolean;
  isDemo: boolean;
  loading: boolean;
  refetchOnboarding: () => void;
  user: UserProfile | null;
};

const OnboardingContext = createContext<OnboardingContextType>({
  onboarding: null,
  hasActiveSubscription: false,
  isDemo: false,
  loading: true,
  refetchOnboarding: () => {},
  user: null,
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
        isDemo: data?.me?.isDemo ?? false,
        loading,
        refetchOnboarding: refetch,
        user: data?.me
          ? {
              id: data.me.id,
              name: data.me.name,
              email: data.me.email,
              image: data.me.image,
            }
          : null,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  return useContext(OnboardingContext);
}
