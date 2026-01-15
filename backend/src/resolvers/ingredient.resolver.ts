import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import Ingredient, { IngredientInput } from "../entities/ingredient.entity";
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
      relations: ["ingredientCategory"],
    });

    return ingredients;
  }

  @Authorized()
  @Mutation(() => Ingredient)
  async createIngredient(
    @Ctx() ctx: ContextType,
    @Arg("ingredient", () => IngredientInput) ingredient: IngredientInput
  ) {
    const user = ctx.currentUser;
    if (!user) {
      throw new Error("Vous n'êtes pas connecté");
    }

    const newIngredient = Ingredient.create({
      name: ingredient.name,
      ingredientCategory: { id: ingredient.ingredientCategoryId },
      restaurant: { id: ingredient.restaurantId },
    });

    const savedIngredient = await newIngredient.save();

    const ingredientWithRelations = await Ingredient.findOne({
      where: { id: savedIngredient.id },
      relations: ["ingredientCategory"],
    });

    if (!ingredientWithRelations) {
      throw new Error("Erreur lors de la création de l'ingrédient");
    }

    return ingredientWithRelations;
  }
}

export default IngredientResolver;
