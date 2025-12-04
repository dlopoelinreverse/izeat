import { buildSchema } from "type-graphql";
import UserResolver from "./resolvers/user.resolver";
import RestaurantResolver from "./resolvers/restaurant.resolver";
import { authChecker } from "./auth";
import SessionResolver from "./resolvers/session.resolver";

export default buildSchema({
  resolvers: [UserResolver, RestaurantResolver, SessionResolver],
  authChecker,
});
