import { Query, Resolver } from "type-graphql";
import Menu from "../entities/menu.entity";

@Resolver()
class MenuResolver {
  @Query(() => [Menu])
  async menus() {
    return await Menu.find();
  }
}

export default MenuResolver;
