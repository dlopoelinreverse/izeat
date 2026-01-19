import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import RestaurantTable, {
  CreateTableInput,
} from "../entities/restaurant-table.entity";
import { ContextType } from "../types";

@Resolver()
class RestaurantTableResolver {
  @Authorized()
  @Query(() => [RestaurantTable])
  async getRestaurantTables(
    @Arg("restaurantId") restaurantId: string,
    @Ctx() ctx: ContextType,
  ) {
    const user = ctx.currentUser;
    if (!user) {
      throw new Error("Vous n'êtes pas connecté");
    }

    const tables = await RestaurantTable.find({
      where: { restaurantId, restaurant: { owner: user } },
    });

    if (!tables) {
      throw new Error("Les tables n'ont pas été trouvées");
    }

    return tables;
  }

  @Authorized()
  @Mutation(() => RestaurantTable)
  async createTable(
    @Arg("tableInput") tableInput: CreateTableInput,
    @Ctx() ctx: ContextType,
  ) {
    const user = ctx.currentUser;
    if (!user) {
      throw new Error("Vous n'êtes pas connecté");
    }

    const { restaurantId, number, capacity } = tableInput;

    const table = await RestaurantTable.create({
      restaurantId,
      number,
      capacity,
    }).save();

    return table;
  }

  @Authorized()
  @Mutation(() => Boolean)
  async deleteTable(@Arg("id") id: string, @Ctx() ctx: ContextType) {
    const user = ctx.currentUser;
    if (!user) {
      throw new Error("Vous n'êtes pas connecté");
    }

    const table = await RestaurantTable.findOne({
      where: { id, restaurant: { owner: user } },
    });

    if (!table) {
      throw new Error("Table non trouvée");
    }

    await table.remove();

    return true;
  }
}

export default RestaurantTableResolver;
