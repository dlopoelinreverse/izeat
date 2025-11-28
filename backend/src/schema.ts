import { buildSchema } from "type-graphql";
import UserResolver from "./resolvers/user.resolver";
import { authChecker } from "./auth";

export default buildSchema({
  resolvers: [UserResolver],
  authChecker,
});
