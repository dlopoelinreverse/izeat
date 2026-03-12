import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { ILike } from "typeorm";
import Dish, {
  DeleteDishResponse,
  DishInput,
  UpdateDishInput,
} from "../entities/dish.entity";
import DishIngredient from "../entities/dish-ingredient.entity";
import Restaurant from "../entities/restaurant.entity";
import { ContextType } from "../types";

@Resolver()
class DishResolver {
  @Authorized()
  @Query(() => [Dish])
  async getRestaurantDishes(
    @Arg("restaurantId", () => String) restaurantId: string,
    @Arg("search", () => String, { nullable: true }) search: string | null,
    @Ctx() ctx: ContextType,
  ) {
    const user = ctx.currentUser;
    if (!user) {
      throw new Error("Vous n'êtes pas connecté");
    }

    const restaurant = await Restaurant.findOne({
      where: { id: restaurantId, owner: { id: user.id } },
    });

    if (!restaurant) {
      throw new Error("Le restaurant n'a pas été trouvé");
    }

    const where: Record<string, unknown> = { restaurantId };
    if (search) {
      where.name = ILike(`%${search}%`);
    }

    return Dish.find({
      where,
      relations: ["ingredients", "ingredients.ingredient"],
    });
  }

  @Authorized()
  @Query(() => Dish, { nullable: true })
  async getDish(@Arg("id", () => String) id: string) {
    return Dish.findOne({
      where: { id },
      relations: [
        "ingredients",
        "ingredients.ingredient",
        "ingredients.ingredient.ingredientCategory",
      ],
    });
  }

  @Authorized()
  @Mutation(() => Dish)
  async createDish(
    @Arg("dishInput") input: DishInput,
    @Ctx() ctx: ContextType,
  ) {
    const user = ctx.currentUser;
    if (!user) {
      throw new Error("Vous n'êtes pas connecté");
    }

    const restaurant = await Restaurant.findOne({
      where: { id: input.restaurantId, owner: { id: user.id } },
    });

    if (!restaurant) {
      throw new Error("Le restaurant n'a pas été trouvé");
    }

    const dish = await Dish.create({
      name: input.name,
      description: input.description,
      price: input.price,
      restaurantId: input.restaurantId,
    }).save();

    if (input.ingredientsId && input.ingredientsId.length > 0) {
      const links = input.ingredientsId.map((id) =>
        DishIngredient.create({ dish, ingredient: { id } }),
      );
      await DishIngredient.save(links);
    }

    return Dish.findOneOrFail({
      where: { id: dish.id },
      relations: [
        "ingredients",
        "ingredients.ingredient",
        "ingredients.ingredient.ingredientCategory",
      ],
    });
  }

  @Authorized()
  @Mutation(() => Dish)
  async updateDish(
    @Arg("updateDishInput") input: UpdateDishInput,
    @Ctx() ctx: ContextType,
  ) {
    const user = ctx.currentUser;
    if (!user) {
      throw new Error("Vous n'êtes pas connecté");
    }

    const dish = await Dish.findOne({
      where: { id: input.id, restaurant: { owner: { id: user.id } } },
      relations: ["ingredients"],
    });

    if (!dish) {
      throw new Error("Le plat n'a pas été trouvé");
    }

    dish.name = input.name;
    dish.description = input.description;
    dish.price = input.price;
    await dish.save();

    // Replace ingredients
    await DishIngredient.delete({ dish: { id: dish.id } });

    if (input.ingredientsId && input.ingredientsId.length > 0) {
      const links = input.ingredientsId.map((ingId) =>
        DishIngredient.create({ dish, ingredient: { id: ingId } }),
      );
      await DishIngredient.save(links);
    }

    return Dish.findOneOrFail({
      where: { id: dish.id },
      relations: [
        "ingredients",
        "ingredients.ingredient",
        "ingredients.ingredient.ingredientCategory",
      ],
    });
  }

  @Authorized()
  @Mutation(() => DeleteDishResponse)
  async deleteDish(
    @Arg("id", () => String) id: string,
    @Ctx() ctx: ContextType,
  ) {
    const user = ctx.currentUser;
    if (!user) {
      throw new Error("Vous n'êtes pas connecté");
    }

    const dish = await Dish.findOne({
      where: { id, restaurant: { owner: { id: user.id } } },
    });

    if (!dish) {
      throw new Error("Le plat n'a pas été trouvé");
    }

    const dishId = dish.id;
    await dish.remove();

    return { id: dishId };
  }
}

export default DishResolver;
