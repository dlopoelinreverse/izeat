import { Query, Resolver } from "type-graphql";
import User from "../entities/user.entity";

@Resolver()
class UserResolver {
  @Query(() => User)
  async findUserBySession() {
    await User.findOneBy({
      sessions: {},
    });
  }
}

export default UserResolver;
