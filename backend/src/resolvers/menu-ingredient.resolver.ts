import { Arg, Authorized, Ctx, Mutation, Resolver } from "type-graphql";
import { ContextType } from "../types";
import Ingredient from "../entities/ingredient";

@Resolver()
class MenuIngredientResolver {
  @Authorized()
  @Mutation(() => Ingredient)
  async createMenuIngredient(
    @Arg("name", () => String) name: string,
    @Ctx() ctx: ContextType
  ) {
    return await Ingredient.create({ name }).save();
  }
}

export default MenuIngredientResolver;
