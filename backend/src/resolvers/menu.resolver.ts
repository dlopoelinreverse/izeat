import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import Menu, { MenuResponse } from "../entities/menu.entity";
import { ContextType } from "../types";
import Restaurant from "../entities/restaurant.entity";

@Resolver()
class MenuResolver {
  @Authorized()
  @Mutation(() => Menu)
  async createMenu(
    @Arg("name", () => String) name: string,
    @Arg("restaurantId", () => String) restaurantId: string,
    @Ctx() ctx: ContextType,
  ) {
    const user = ctx.currentUser;
    if (!user) {
      throw new Error("Vous n'êtes pas connecté");
    }

    const restaurant = await Restaurant.findOne({
      where: { id: restaurantId, owner: user },
      relations: ["menus"],
    });

    if (!restaurant) {
      throw new Error("Le restaurant n'a pas été trouvé");
    }

    if (restaurant.menus.some((menu) => menu.name === name)) {
      throw new Error("Le menu existe déjà");
    }

    const menu = Menu.create({ name, restaurantId });

    menu.items = [];
    menu.categories = [];

    await menu.save();

    return menu;
  }

  @Authorized()
  @Mutation(() => Boolean)
  async deleteMenu(
    @Arg("id", () => String) id: string,
    @Ctx() ctx: ContextType,
  ) {
    const user = ctx.currentUser;
    if (!user) {
      throw new Error("Vous n'êtes pas connecté");
    }

    const menu = await Menu.findOne({
      where: { id, restaurant: { owner: user } },
    });

    if (!menu) {
      throw new Error("Le menu n'a pas été trouvé");
    }

    await menu.remove();

    return true;
  }

  @Authorized()
  @Query(() => [Menu])
  async getMenus(
    @Arg("restaurantId", () => String) restaurantId: string,
    @Ctx() ctx: ContextType,
  ) {
    const user = ctx.currentUser;
    if (!user) {
      throw new Error("Vous n'êtes pas connecté");
    }

    const menus = await Menu.find({
      where: { restaurantId, restaurant: { owner: user } },
      relations: [
        "categories",
        "categories.items",
        "categories.items.ingredients",
      ],
    });

    if (!menus) {
      throw new Error("Les menus n'ont pas été trouvés");
    }

    return menus;
  }

  @Authorized()
  @Query(() => MenuResponse)
  async getMenu(@Arg("id", () => String) id: string, @Ctx() ctx: ContextType) {
    const user = ctx.currentUser;
    if (!user) {
      throw new Error("Vous n'êtes pas connecté");
    }

    const menu = await Menu.findOne({
      where: { id, restaurant: { owner: user } },
      relations: [
        "categories",
        "categories.items",
        "categories.items.ingredients",
      ],
    });

    if (!menu) {
      throw new Error("Le menu n'a pas été trouvé");
    }

    return {
      id: menu.id,
      name: menu.name,
      restaurantId: menu.restaurantId,
      items: menu.items,
      categories: menu.categories,
    };
  }
}

export default MenuResolver;

export function getMenuById(
  menuId: string,
  additionnalParameter: {},
  relations: string[] = [],
) {
  return Menu.findOne({
    where: { id: menuId, ...additionnalParameter },
    relations: relations,
  });
}
