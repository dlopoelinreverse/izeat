import { Arg, Authorized, Mutation, Query, Resolver } from "type-graphql";
import MenuItem, { MenuItemInput } from "../entities/menu-item.entity";
import MenuItemIngredient from "../entities/menu-item-ingredient";
import MenuCategory from "../entities/menu-category.entity";
import { getMenuById } from "./menu.resolver";

@Resolver()
class MenuItemResolver {
  @Query(() => [MenuItem])
  async menuItems() {
    return MenuItem.find();
  }

  @Authorized()
  @Mutation(() => MenuCategory)
  async createMenuItem(@Arg("menuItemInput") input: MenuItemInput) {
    const { name, restaurantId, menuId, categoryId, ingredientsId } = input;

    const menu = await getMenuById(menuId, { restaurantId }, [
      "restaurant",
      "categories",
    ]);

    if (!menu) {
      throw new Error("Menu not found");
    }

    const category = menu.categories.find(
      (category) => category.id === categoryId,
    );

    if (!category) {
      throw new Error("Category not found");
    }

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

    return await MenuItem.findOneOrFail({
      where: { id: menuItem.id },
      relations: ["ingredients"],
    });
  }
}

export default MenuItemResolver;
