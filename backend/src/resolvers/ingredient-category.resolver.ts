import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import IngredientCategory from "../entities/ingredient-category";
import { ContextType } from "../types";

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

  @Authorized()
  @Mutation(() => IngredientCategory)
  async updateIngredientCategory(
    @Ctx() ctx: ContextType,
    @Arg("id", () => String) id: string,
    @Arg("name", () => String) name: string
  ) {
    const user = ctx.currentUser;
    if (!user) {
      throw new Error("Vous n'êtes pas connecté");
    }

    const category = await IngredientCategory.findOne({
      where: { id, restaurant: { owner: user } },
    });
    if (!category) {
      throw new Error("Catégorie non trouvée");
    }

    category.name = name;
    await category.save();
    return category;
  }

  @Authorized()
  @Mutation(() => Boolean)
  async deleteIngredientCategory(
    @Ctx() ctx: ContextType,
    @Arg("id", () => String) id: string
  ) {
    const user = ctx.currentUser;
    if (!user) {
      throw new Error("Vous n'êtes pas connecté");
    }

    const category = await IngredientCategory.findOne({
      where: { id, restaurant: { owner: user } },
    });
    if (!category) {
      throw new Error("Catégorie non trouvée");
    }

    await category.remove();
    return true;
  }
}

export default IngredientCategoryResolver;
