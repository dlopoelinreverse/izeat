import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import Restaurant, { RestaurantResponse } from "../entities/restaurant.entity";
import { ContextType } from "../types";
import { TopologyDescription } from "typeorm";

@Resolver()
class RestaurantResolver {
  @Authorized()
  @Mutation(() => RestaurantResponse)
  async createRestaurant(
    @Arg("name", () => String) name: string,
    @Ctx() ctx: ContextType
  ) {
    if (!ctx.currentUser) {
      return {
        code: 401,
        success: false,
        message: "Unauthorized",
      };
    }

    const restaurant = await Restaurant.create({
      name,
      owner: ctx.currentUser,
    });

    restaurant.menus = [];
    restaurant.tables = [];

    await restaurant.save();

    return {
      code: 200,
      success: true,
      message: "Le restaurant a été créé avec succès",
      restaurant,
    };
  }

  @Authorized()
  @Query(() => RestaurantResponse)
  async userRestaurant(@Ctx() ctx: ContextType) {
    if (!ctx.currentUser) {
      return {
        code: 401,
        success: false,
        message: "Unauthorized",
      };
    }
    const restaurant = await Restaurant.findOne({
      where: { owner: { id: ctx.currentUser?.id } },
    });

    return {
      code: 200,
      success: true,
      message: "Le restaurant a été récupéré avec succès",
      restaurant,
    };
  }

  @Authorized()
  @Query(() => RestaurantResponse)
  async restaurantDashboardStatus(@Ctx() ctx: ContextType) {
    if (!ctx.currentUser) {
      return {
        code: 401,
        success: false,
        message: "Unauthorized",
      };
    }

    const restaurant = await Restaurant.findOne({
      where: { owner: { id: ctx.currentUser?.id } },
      relations: ["menus", "tables", "menus.categories", "menus.items"],
    });

    return {
      code: 200,
      success: true,
      message: "Le restaurant a été récupéré avec succès",
      restaurant,
    };
  }
}

export default RestaurantResolver;
