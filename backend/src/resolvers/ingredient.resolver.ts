import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import Ingredient, { IngredientInput, UpdateIngredientInput } from "../entities/ingredient.entity";
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

  @Authorized()
  @Mutation(() => Ingredient)
  async updateIngredient(
    @Ctx() ctx: ContextType,
    @Arg("input", () => UpdateIngredientInput) input: UpdateIngredientInput
  ) {
    const user = ctx.currentUser;
    if (!user) {
      throw new Error("Vous n'êtes pas connecté");
    }

    const ingredient = await Ingredient.findOne({
      where: { id: input.id, restaurant: { owner: user } },
    });
    if (!ingredient) {
      throw new Error("Ingrédient non trouvé");
    }

    ingredient.name = input.name;
    ingredient.ingredientCategoryId = input.ingredientCategoryId;
    await ingredient.save();

    return Ingredient.findOneOrFail({
      where: { id: ingredient.id },
      relations: ["ingredientCategory"],
    });
  }

  @Authorized()
  @Mutation(() => Boolean)
  async toggleIngredientAvailable(
    @Ctx() ctx: ContextType,
    @Arg("id", () => String) id: string
  ) {
    const user = ctx.currentUser;
    if (!user) {
      throw new Error("Vous n'êtes pas connecté");
    }

    const ingredient = await Ingredient.findOne({
      where: { id, restaurant: { owner: user } },
    });
    if (!ingredient) {
      throw new Error("Ingrédient non trouvé");
    }

    ingredient.available = !ingredient.available;
    await ingredient.save();
    return ingredient.available;
  }

  @Authorized()
  @Mutation(() => Boolean)
  async deleteIngredient(
    @Ctx() ctx: ContextType,
    @Arg("id", () => String) id: string
  ) {
    const user = ctx.currentUser;
    if (!user) {
      throw new Error("Vous n'êtes pas connecté");
    }

    const ingredient = await Ingredient.findOne({
      where: { id, restaurant: { owner: user } },
    });
    if (!ingredient) {
      throw new Error("Ingrédient non trouvé");
    }

    await ingredient.remove();
    return true;
  }
}

export default IngredientResolver;
