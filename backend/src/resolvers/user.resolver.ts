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

  @Query(() => [User])
  async getAllUsers() {
    return await User.find({
      relations: ["sessions"],
    });
  }
}

export default UserResolver;
