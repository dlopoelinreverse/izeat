import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import MenuItem, {
  CreateDishAndMenuItemInput,
  DeleteMenuItemResponse,
  MenuItemInput,
} from "../entities/menu-item.entity";
import Dish from "../entities/dish.entity";
import DishIngredient from "../entities/dish-ingredient.entity";
import MenuCategory from "../entities/menu-category.entity";
import { getMenuById } from "./menu.resolver";
import { ContextType } from "../types";

@Resolver()
class MenuItemResolver {
  @Query(() => [MenuItem])
  async menuItems() {
    return MenuItem.find({ relations: ["dish"] });
  }

  @Authorized()
  @Query(() => MenuItem, { nullable: true })
  async getMenuItem(@Arg("id") id: string) {
    return MenuItem.findOne({
      where: { id },
      relations: [
        "dish",
        "dish.ingredients",
        "dish.ingredients.ingredient",
        "dish.ingredients.ingredient.ingredientCategory",
      ],
    });
  }

  @Authorized()
  @Mutation(() => MenuItem)
  async createMenuItem(
    @Arg("menuItemInput") input: MenuItemInput,
    @Ctx() ctx: ContextType,
  ) {
    const user = ctx.currentUser;
    if (!user) {
      throw new Error("Vous n'êtes pas connecté");
    }

    const { dishId, menuId, categoryId, priceOverride } = input;

    // Validate dish exists and belongs to user's restaurant
    const dish = await Dish.findOne({
      where: { id: dishId, restaurant: { owner: { id: user.id } } },
    });

    if (!dish) {
      throw new Error("Le plat n'a pas été trouvé");
    }

    // Validate menu and category
    const menu = await getMenuById(menuId, { restaurantId: dish.restaurantId }, [
      "restaurant",
      "categories",
    ]);

    if (!menu) {
      throw new Error("Le menu n'a pas été trouvé");
    }

    const category = menu.categories.find((c) => c.id === categoryId);
    if (!category) {
      throw new Error("La catégorie n'a pas été trouvée");
    }

    // Check if dish is already linked to this category
    const existing = await MenuItem.findOne({
      where: { dishId, categoryId },
    });

    if (existing) {
      throw new Error("Ce plat est déjà lié à cette catégorie");
    }

    const menuItem = await MenuItem.create({
      dish,
      menu,
      category,
      priceOverride: priceOverride ?? null,
    }).save();

    return MenuItem.findOneOrFail({
      where: { id: menuItem.id },
      relations: [
        "dish",
        "dish.ingredients",
        "dish.ingredients.ingredient",
        "dish.ingredients.ingredient.ingredientCategory",
      ],
    });
  }

  @Authorized()
  @Mutation(() => MenuItem)
  async createDishAndMenuItem(
    @Arg("input") input: CreateDishAndMenuItemInput,
    @Ctx() ctx: ContextType,
  ) {
    const user = ctx.currentUser;
    if (!user) {
      throw new Error("Vous n'êtes pas connecté");
    }

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
      throw new Error("Le menu n'a pas été trouvé");
    }

    const category = menu.categories.find((c) => c.id === categoryId);
    if (!category) {
      throw new Error("La catégorie n'a pas été trouvée");
    }

    // Create the Dish
    const dish = await Dish.create({
      name,
      description,
      price,
      restaurantId,
    }).save();

    // Create ingredient links
    if (ingredientsId && ingredientsId.length > 0) {
      const links = ingredientsId.map((id) =>
        DishIngredient.create({ dish, ingredient: { id } }),
      );
      await DishIngredient.save(links);
    }

    // Create the MenuItem link
    const menuItem = await MenuItem.create({
      dish,
      menu,
      category,
    }).save();

    return MenuItem.findOneOrFail({
      where: { id: menuItem.id },
      relations: [
        "dish",
        "dish.ingredients",
        "dish.ingredients.ingredient",
        "dish.ingredients.ingredient.ingredientCategory",
      ],
    });
  }

  @Authorized()
  @Mutation(() => MenuItem)
  async updateMenuItem(
    @Arg("id") id: string,
    @Arg("menuItemInput") input: MenuItemInput,
  ) {
    const { categoryId, priceOverride } = input;

    const menuItem = await MenuItem.findOne({
      where: { id },
    });

    if (!menuItem) {
      throw new Error("L'élément de menu n'a pas été trouvé");
    }

    if (categoryId !== menuItem.categoryId) {
      const category = await MenuCategory.findOne({
        where: { id: categoryId },
      });
      if (!category) {
        throw new Error("La catégorie n'a pas été trouvée");
      }
      menuItem.category = category;
    }

    menuItem.priceOverride = priceOverride ?? null;
    await menuItem.save();

    return MenuItem.findOneOrFail({
      where: { id: menuItem.id },
      relations: [
        "dish",
        "dish.ingredients",
        "dish.ingredients.ingredient",
        "dish.ingredients.ingredient.ingredientCategory",
      ],
    });
  }

  @Authorized()
  @Mutation(() => DeleteMenuItemResponse)
  async deleteMenuItem(@Arg("id") id: string) {
    const menuItem = await MenuItem.findOne({
      where: { id },
    });

    if (!menuItem) {
      throw new Error("L'élément de menu n'a pas été trouvé");
    }

    const itemId = menuItem.id;
    await menuItem.remove();

    return { id: itemId };
  }
}

export default MenuItemResolver;
