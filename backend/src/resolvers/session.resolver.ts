import { Arg, Query, Resolver } from "type-graphql";
import Session from "../entities/session.entity";

@Resolver()
class SessionResolver {
  @Query(() => Session)
  async getSession(@Arg("token") token: string) {
    return Session.findOne({ where: { token }, relations: ["user"] });
  }
}

export default SessionResolver;
