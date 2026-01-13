import { Arg, Authorized, Mutation, Query, Resolver } from "type-graphql";
import IngredientCategory from "../entities/ingredient-category";

@Resolver()
class IngredientCategoryResolver {
  @Authorized()
  @Query(() => [IngredientCategory], { nullable: true })
  async getRestaurantIngredientCategories(
    @Arg("restaurantId", () => String) restaurantId: string
  ) {
    return IngredientCategory.find({
      where: { restaurant: { id: restaurantId } },
    });
  }

  @Authorized()
  @Mutation(() => IngredientCategory)
  async createIngredientCategory(
    @Arg("restaurantId", () => String) restaurantId: string,
    @Arg("name", () => String) name: string
  ) {
    return IngredientCategory.create({
      name,
      restaurant: { id: restaurantId },
    }).save();
  }
}

export default IngredientCategoryResolver;
