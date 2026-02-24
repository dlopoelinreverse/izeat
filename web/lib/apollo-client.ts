import { ApolloClient, HttpLink, InMemoryCache, split } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_APOLLO_URI_SERVER,
  credentials: "include",
});

const link =
  typeof window !== "undefined"
    ? split(
        ({ query }) => {
          const def = getMainDefinition(query);
          return (
            def.kind === "OperationDefinition" &&
            def.operation === "subscription"
          );
        },
        new GraphQLWsLink(
          createClient({ url: process.env.NEXT_PUBLIC_APOLLO_WS_URI! }),
        ),
        httpLink,
      )
    : httpLink;

const client = new ApolloClient({ link, cache: new InMemoryCache() });

export default client;
