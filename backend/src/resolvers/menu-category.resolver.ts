import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import MenuCategory from "../entities/menu-category.entity";
import { ContextType } from "../types";
import Menu from "../entities/menu.entity";

@Resolver()
class MenuCategoryResolver {
  @Authorized()
  @Mutation(() => MenuCategory)
  async createMenuCategory(
    @Arg("name", () => String) name: string,
    @Arg("menuId", () => String) menuId: string,
    @Ctx() ctx: ContextType
  ) {
    const user = ctx.currentUser;
    if (!user) {
      throw new Error("Vous n'êtes pas connecté");
    }

    const menu = await Menu.findOne({
      where: { id: menuId, restaurant: { owner: user } },
    });

    if (!menu) {
      throw new Error("Le menu n'a pas été trouvé");
    }

    const menuCategory = MenuCategory.create({ name, menu });

    await menuCategory.save();

    return menuCategory;
  }

  @Authorized()
  @Mutation(() => Boolean)
  async deleteMenuCategory(
    @Arg("categoryId", () => String) categoryId: string,
    @Ctx() ctx: ContextType
  ) {
    const user = ctx.currentUser;
    if (!user) {
      throw new Error("Vous n'êtes pas connecté");
    }

    const menuCategory = await MenuCategory.findOne({
      where: { id: categoryId, menu: { restaurant: { owner: user } } },
    });

    if (!menuCategory) {
      throw new Error("La categorie n'a pas été trouvée");
    }

    await menuCategory.remove();

    return true;
  }

  @Authorized()
  @Query(() => [MenuCategory])
  async getMenuCategories(
    @Arg("menuId", () => String) menuId: string,
    @Ctx() ctx: ContextType
  ) {
    const user = ctx.currentUser;
    if (!user) {
      throw new Error("Vous n'êtes pas connecté");
    }

    const menu = await Menu.findOne({
      where: { id: menuId, restaurant: { owner: user } },
      relations: ["categories"],
    });

    if (!menu) {
      throw new Error("Le menu n'a pas été trouvé");
    }

    const menuCategory = menu.categories;

    return menuCategory;
  }
}

export default MenuCategoryResolver;
