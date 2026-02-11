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
  @Mutation(() => MenuItem)
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

    // 1. Création de l'item (ça suffit pour la relation)
    const menuItem = await MenuItem.create({
      name,
      menu,
      category,
    }).save();

    // 2. Lien ingrédients
    if (ingredientsId && ingredientsId.length > 0) {
      const ingredientLinks = ingredientsId.map((id) =>
        MenuItemIngredient.create({
          item: menuItem,
          ingredient: { id },
        }),
      );

      await MenuItemIngredient.save(ingredientLinks);
    }

    // 3. Retour avec relations
    return MenuItem.findOneOrFail({
      where: { id: menuItem.id },
      relations: ["ingredients", "ingredients.ingredient.ingredientCategory"],
    });
  }
}

export default MenuItemResolver;
