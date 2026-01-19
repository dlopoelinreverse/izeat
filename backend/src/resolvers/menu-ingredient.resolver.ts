import { Arg, Authorized, Ctx, Mutation, Resolver } from "type-graphql";
import { ContextType } from "../types";
import Ingredient from "../entities/ingredient.entity";

@Resolver()
class MenuIngredientResolver {}

export default MenuIngredientResolver;
