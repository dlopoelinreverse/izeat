import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import Menu, { MenuResponse } from "../entities/menu.entity";
import { ContextType } from "../types";
import Restaurant from "../entities/restaurant.entity";

@Resolver()
class MenuResolver {
  @Query(() => [Menu])
  async menus() {
    return await Menu.find();
  }

  @Authorized()
  @Mutation(() => MenuResponse)
  async createMenu(
    @Arg("name", () => String) name: string,
    @Arg("restaurantId", () => String) restaurantId: string,
    @Ctx() ctx: ContextType
  ) {
    const user = ctx.currentUser;
    if (!user) {
      throw new Error("Unauthorized");
    }

    const restaurant = await Restaurant.findOne({
      where: { id: restaurantId, owner: user },
      relations: ["menus"],
    });

    if (!restaurant) {
      return {
        code: 404,
        success: false,
        message: "Le restaurant n'a pas été trouvé",
      };
    }

    if (restaurant.menus.some((menu) => menu.name === name)) {
      return {
        code: 400,
        success: false,
        message: "Le menu existe déjà",
      };
    }

    const menu = Menu.create({ name, restaurantId });

    menu.items = [];

    await menu.save();

    return {
      code: 200,
      success: true,
      message: "Le menu a été créé avec succès",
      menu,
    };
  }

  @Authorized()
  @Mutation(() => MenuResponse)
  async deleteMenu(
    @Arg("id", () => String) id: string,
    @Ctx() ctx: ContextType
  ) {
    const user = ctx.currentUser;
    if (!user) {
      throw new Error("Unauthorized");
    }

    const menu = await Menu.findOne({
      where: { id, restaurant: { owner: user } },
    });

    if (!menu) {
      return {
        code: 404,
        success: false,
        message: "Le menu n'a pas été trouvé",
      };
    }

    await menu.remove();

    return {
      code: 200,
      success: true,
      message: "Le menu a été supprimé avec succès",
    };
  }
}

export default MenuResolver;
