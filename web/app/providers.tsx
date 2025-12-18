import { ApolloProviderComponent } from "./apollo-provider";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProviderComponent>
      <NuqsAdapter>{children}</NuqsAdapter>
    </ApolloProviderComponent>
  );
}
