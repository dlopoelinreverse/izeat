import { Arg, Mutation, Query, Resolver } from "type-graphql";
import Menu from "../entities/menu.entity";

@Resolver()
class MenuResolver {
  @Query(() => [Menu])
  async menus() {
    return await Menu.find();
  }

  @Mutation(() => Menu)
  async createMenu(
    @Arg("name", () => String) name: string,
    @Arg("restaurantId", () => String) restaurantId: string
  ) {
    const menu = await Menu.create({ name, restaurantId }).save();
    return menu;
  }
}

export default MenuResolver;
