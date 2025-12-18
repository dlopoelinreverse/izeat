"use client";
import client from "@/lib/apollo-client";
import { ApolloProvider } from "@apollo/client/react";

export function ApolloProviderComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
