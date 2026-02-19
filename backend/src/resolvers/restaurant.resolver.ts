import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import Restaurant from "../entities/restaurant.entity";
import { ContextType } from "../types";

@Resolver()
class RestaurantResolver {
  @Authorized()
  @Mutation(() => Restaurant)
  async createRestaurant(
    @Arg("name", () => String) name: string,
    @Ctx() ctx: ContextType
  ) {
    if (!ctx.currentUser) {
      throw new Error("Vous n'êtes pas connecté");
    }

    const restaurant = await Restaurant.create({
      name,
      owner: ctx.currentUser,
    });

    restaurant.menus = [];
    restaurant.tables = [];

    await restaurant.save();

    return restaurant;
  }

  @Authorized()
  @Query(() => Restaurant)
  async userRestaurant(@Ctx() ctx: ContextType) {
    if (!ctx.currentUser) {
      throw new Error("Vous n'êtes pas connecté");
    }
    const restaurant = await Restaurant.findOne({
      where: { owner: { id: ctx.currentUser?.id } },
    });

    return restaurant;
  }
}

export default RestaurantResolver;
