import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { cookies } from "next/headers";
import fetch from "cross-fetch";

export async function getServerApolloClient() {
  const cookieStore = await cookies();

  const parsedCookie = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  return new ApolloClient({
    ssrMode: true,
    link: new HttpLink({
      uri: "http://backend:4001/graphql",
      fetch,
      credentials: "include",
      headers: {
        cookie: parsedCookie, // ⬅️ cookies du visiteur
      },
    }),
    cache: new InMemoryCache(),
  });
}
