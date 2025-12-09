import { Arg, Mutation, Query, Resolver } from "type-graphql";
import MenuItem from "../entities/menu-item.entity";

@Resolver()
class MenuItemResolver {
  @Query(() => [MenuItem])
  async menuItems() {
    return MenuItem.find();
  }

  @Mutation(() => MenuItem)
  async createMenuItem(
    @Arg("name", () => String) name: string,
    @Arg("menuId", () => String) menuId: string,
    @Arg("categoryId", () => String) categoryId: string
  ) {
    const menuItem = await MenuItem.create({ name, menuId, categoryId }).save();
    return menuItem;
  }
}

export default MenuItemResolver;
