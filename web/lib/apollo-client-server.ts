import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { cookies } from "next/headers";
import fetch from "cross-fetch";

import dotenv from "dotenv";
dotenv.config();

export async function getServerApolloClient() {
  const cookieStore = await cookies();

  const parsedCookie = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  return new ApolloClient({
    ssrMode: true,
    link: new HttpLink({
      uri: process.env.SERVER_APOLLO_URI as string,
      fetch,
      credentials: "include",
      headers: {
        cookie: parsedCookie,
      },
    }),
    cache: new InMemoryCache(),
  });
}
