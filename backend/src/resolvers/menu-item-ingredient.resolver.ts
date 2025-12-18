import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import MenuItemIngredient from "../entities/menu-item-ingredient";
import { ContextType } from "../types";

@Resolver()
class MenuItemIngredientResolver {
  @Mutation(() => MenuItemIngredient)
  async createMenuItemIngredient(
    @Arg("itemId") itemId: string,
    @Arg("ingredientId") ingredientId: string,
    @Ctx() ctx: ContextType
  ) {
    return await MenuItemIngredient.create({
      item: { id: itemId },
      ingredient: { id: ingredientId },
    }).save();
  }
}

export default MenuItemIngredientResolver;
