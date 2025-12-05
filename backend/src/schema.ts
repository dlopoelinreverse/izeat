import { buildSchema } from "type-graphql";
import UserResolver from "./resolvers/user.resolver";
import RestaurantResolver from "./resolvers/restaurant.resolver";
import { authChecker } from "./auth";
import SessionResolver from "./resolvers/session.resolver";
import MenuResolver from "./resolvers/menu.resolver";

export default buildSchema({
  resolvers: [UserResolver, RestaurantResolver, SessionResolver, MenuResolver],
  authChecker,
});
