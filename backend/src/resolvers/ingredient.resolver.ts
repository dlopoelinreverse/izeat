import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import Ingredient from "../entities/ingredient.entity";
import { ContextType } from "../types";

@Resolver()
class IngredientResolver {
  @Authorized()
  @Query(() => [Ingredient], { nullable: true })
  async getRestaurantIngredients(
    @Ctx() ctx: ContextType,
    @Arg("restaurantId", () => String) restaurantId: string
  ) {
    const user = ctx.currentUser;
    if (!user) {
      throw new Error("Vous n'êtes pas connecté");
    }

    const ingredients = await Ingredient.find({
      where: { restaurant: { owner: user, id: restaurantId } },
    });

    return ingredients;
  }
}

export default IngredientResolver;
