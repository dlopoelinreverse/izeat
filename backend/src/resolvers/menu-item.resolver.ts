import { Arg, Authorized, Mutation, Query, Resolver } from "type-graphql";
import MenuItem, {
  DeleteMenuItemResponse,
  MenuItemInput,
} from "../entities/menu-item.entity";
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
  @Query(() => MenuItem, { nullable: true })
  async getMenuItem(@Arg("id") id: string) {
    return MenuItem.findOne({
      where: { id },
      relations: ["ingredients", "ingredients.ingredient.ingredientCategory"],
    });
  }

  @Authorized()
  @Mutation(() => MenuItem)
  async createMenuItem(@Arg("menuItemInput") input: MenuItemInput) {
    const {
      name,
      description,
      price,
      restaurantId,
      menuId,
      categoryId,
      ingredientsId,
    } = input;

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
      menu,
      description,
      price,
      category,
    }).save();

    if (ingredientsId && ingredientsId.length > 0) {
      const ingredientLinks = ingredientsId.map((id) =>
        MenuItemIngredient.create({
          item: menuItem,
          ingredient: { id },
        }),
      );

      await MenuItemIngredient.save(ingredientLinks);
    }

    return MenuItem.findOneOrFail({
      where: { id: menuItem.id },
      relations: ["ingredients", "ingredients.ingredient.ingredientCategory"],
    });
  }

  @Authorized()
  @Mutation(() => MenuItem)
  async updateMenuItem(
    @Arg("id") id: string,
    @Arg("menuItemInput") input: MenuItemInput,
  ) {
    const { name, description, price, ingredientsId, categoryId } = input;

    const menuItem = await MenuItem.findOne({
      where: { id },
      relations: ["ingredients"],
    });

    if (!menuItem) {
      throw new Error("MenuItem not found");
    }

    menuItem.name = name;
    menuItem.description = description;
    menuItem.price = price;

    if (categoryId !== menuItem.categoryId) {
      const category = await MenuCategory.findOne({
        where: { id: categoryId },
      });
      if (!category) {
        throw new Error("Category not found");
      }
      menuItem.category = category;
    }

    await menuItem.save();

    await MenuItemIngredient.delete({ item: { id: menuItem.id } });

    if (ingredientsId && ingredientsId.length > 0) {
      const ingredientLinks = ingredientsId.map((ingId) =>
        MenuItemIngredient.create({
          item: menuItem,
          ingredient: { id: ingId },
        }),
      );
      await MenuItemIngredient.save(ingredientLinks);
    }

    return MenuItem.findOneOrFail({
      where: { id: menuItem.id },
      relations: ["ingredients", "ingredients.ingredient.ingredientCategory"],
    });
  }
  @Authorized()
  @Mutation(() => DeleteMenuItemResponse)
  async deleteMenuItem(@Arg("id") id: string) {
    const menuItem = await MenuItem.findOne({
      where: { id },
    });

    if (!menuItem) {
      throw new Error("MenuItem not found");
    }

    const itemId = menuItem.id;

    await menuItem.remove();

    return { id: itemId };
  }
}

export default MenuItemResolver;
