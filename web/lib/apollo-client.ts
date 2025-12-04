import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  //   ssrMode: true,
  link: new HttpLink({
    uri: process.env.NEXT_PUBLIC_APOLLO_URI_SERVER,
    credentials: "include",
  }),
  cache: new InMemoryCache(),
});

export default client;
