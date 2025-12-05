import { Arg, Authorized, Mutation, Query, Resolver } from "type-graphql";
import Restaurant from "../entities/restaurant.entity";

@Resolver()
class RestaurantResolver {
  @Authorized()
  @Mutation(() => Restaurant)
  async createRestaurant(@Arg("name", () => String) name: string) {
    const restaurant = await Restaurant.create({ name }).save();
    return restaurant;
  }

  @Query(() => Restaurant)
  async getUserRestaurant(@Arg("userId", () => String) userId: string) {
    const restaurant = await Restaurant.findOne({
      where: { user: { id: userId } },
    });
    return restaurant;
  }

  @Authorized()
  @Query(() => [Restaurant])
  async getAllRestaurants() {
    const restaurants = await Restaurant.find({ relations: ["user"] });
    return restaurants;
  }
}

export default RestaurantResolver;
