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
      throw new Error("Unauthorized");
    }

    const restaurant = await Restaurant.create({
      name,
      owner: ctx.currentUser,
    }).save();
    return restaurant;
  }

  @Authorized()
  @Query(() => Restaurant, { nullable: true })
  async getUserRestaurant(@Ctx() ctx: ContextType) {
    if (!ctx.currentUser) {
      throw new Error("Unauthorized");
    }
    const restaurant = await Restaurant.findOne({
      where: { owner: { id: ctx.currentUser?.id } },
      relations: ["owner"],
    });

    return restaurant || null;
  }

  @Authorized()
  @Query(() => Restaurant, { nullable: true })
  async getDashboardRestaurantStatus(@Ctx() ctx: ContextType) {
    if (!ctx.currentUser) {
      throw new Error("Unauthorized");
    }

    const restaurant = await Restaurant.findOne({
      where: { owner: { id: ctx.currentUser?.id } },
      relations: ["menus", "tables", "menus.items.category"],
    });

    return restaurant || null;
  }

  @Authorized()
  @Query(() => [Restaurant])
  async getAllRestaurants() {
    const restaurants = await Restaurant.find({ relations: ["user"] });
    return restaurants;
  }
}

export default RestaurantResolver;
