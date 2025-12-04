import { Arg, Authorized, Mutation, Resolver } from "type-graphql";
import Restaurant from "../entities/restaurant.entity";

@Resolver()
class RestaurantResolver {
  @Authorized()
  @Mutation(() => Restaurant)
  async createRestaurant(@Arg("name", () => String) name: string) {
    console.log("name", name);
    const restaurant = await Restaurant.create({ name }).save();
    console.log("restaurant", restaurant);
    return restaurant;
  }
}

export default RestaurantResolver;
