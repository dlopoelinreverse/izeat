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
    @Ctx() ctx: ContextType,
  ) {
    const user = ctx.currentUser;
    if (!user) {
      throw new Error("Vous n'êtes pas connecté");
    }

    const menu = await Menu.findOne({
      where: { id: menuId, restaurant: { owner: { id: user.id } } },
      relations: ["categories"],
    });

    if (!menu) {
      throw new Error("Le menu n'a pas été trouvé");
    }

    const order = menu.categories ? menu.categories.length : 0;

    const menuCategory = MenuCategory.create({ name, menu, order });

    await menuCategory.save();

    return menuCategory;
  }

  @Authorized()
  @Mutation(() => Boolean)
  async deleteMenuCategory(
    @Arg("categoryId", () => String) categoryId: string,
    @Ctx() ctx: ContextType,
  ) {
    const user = ctx.currentUser;
    if (!user) {
      throw new Error("Vous n'êtes pas connecté");
    }

    const menuCategory = await MenuCategory.findOne({
      where: { id: categoryId, menu: { restaurant: { owner: { id: user.id } } } },
    });

    if (!menuCategory) {
      throw new Error("La categorie n'a pas été trouvée");
    }

    await menuCategory.remove();

    return true;
  }

  @Authorized()
  @Mutation(() => Boolean)
  async reorderMenuCategories(
    @Arg("menuId", () => String) menuId: string,
    @Arg("orderedIds", () => [String]) orderedIds: string[],
    @Ctx() ctx: ContextType,
  ) {
    const user = ctx.currentUser;
    if (!user) {
      throw new Error("Vous n'êtes pas connecté");
    }

    const menu = await Menu.findOne({
      where: { id: menuId, restaurant: { owner: { id: user.id } } },
    });

    if (!menu) {
      throw new Error("Le menu n'a pas été trouvé");
    }

    await Promise.all(
      orderedIds.map((id, index) => MenuCategory.update(id, { order: index })),
    );

    return true;
  }

  @Authorized()
  @Query(() => [MenuCategory])
  async getMenuCategories(
    @Arg("menuId", () => String) menuId: string,
    @Ctx() ctx: ContextType,
  ) {
    const user = ctx.currentUser;
    if (!user) {
      throw new Error("Vous n'êtes pas connecté");
    }

    const menu = await Menu.findOne({
      where: { id: menuId, restaurant: { owner: { id: user.id } } },
      relations: ["categories", "categories.items"],
      order: { categories: { order: "ASC" } },
    });

    if (!menu) {
      throw new Error("Le menu n'a pas été trouvé");
    }

    return menu.categories;
  }
}

export default MenuCategoryResolver;
