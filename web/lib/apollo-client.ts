import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

// process.env.NEXT_PUBLIC_APOLLO_URI_SERVER

const client = new ApolloClient({
  // ssrMode: true,
  link: new HttpLink({
    // uri: "http://localhost:4001/graphql",
    uri: process.env.NEXT_PUBLIC_APOLLO_URI_SERVER,
    credentials: "include",
  }),
  cache: new InMemoryCache(),
});

export default client;
