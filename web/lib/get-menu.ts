import { cache } from "react"
import { GetActiveMenuDocument } from "@/graphql/__generated__/graphql"
import { getServerApolloClient } from "./apollo-client-server"

export const getMenuForRestaurant = cache(async (restaurantId: string) => {
  const client = await getServerApolloClient()
  const { data } = await client.query({
    query: GetActiveMenuDocument,
    variables: { restaurantId },
  })
  return data?.getActiveMenu ?? null
})
