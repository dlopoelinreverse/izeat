import { Arg, Authorized, Mutation, Query, Resolver } from "type-graphql";
import MenuItem, { MenuItemInput } from "../entities/menu-item.entity";
import MenuItemIngredient from "../entities/menu-item-ingredient";

@Resolver()
class MenuItemResolver {
  @Query(() => [MenuItem])
  async menuItems() {
    return MenuItem.find();
  }

  @Authorized()
  @Mutation(() => MenuItem)
  async createMenuItem(@Arg("menuItemInput") input: MenuItemInput) {
    const { name, menuId, categoryId, ingredientsId } = input;
    const menuItem = await MenuItem.create({
      name,
      menuId,
      category: { id: categoryId },
    }).save();

    if (ingredientsId && ingredientsId.length > 0) {
      const ingredientLinks = ingredientsId.map((id) => {
        return MenuItemIngredient.create({
          item: menuItem,
          ingredient: { id },
        });
      });

      await MenuItemIngredient.save(ingredientLinks);
    }

    return menuItem;
  }
}

export default MenuItemResolver;
