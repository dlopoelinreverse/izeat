import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import QRCode from "qrcode";
import RestaurantTable, {
  CreateTableInput,
  UpdateTableInput,
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

    const existing = await RestaurantTable.findOne({
      where: { restaurantId, number },
    });

    if (existing) {
      throw new Error(`Une table avec le numéro ${number} existe déjà`);
    }

    const table = await RestaurantTable.create({
      restaurantId,
      number,
      capacity,
    }).save();

    const frontendUrl = process.env.FRONTEND_URL ?? "http://localhost:3000";
    const menuUrl = `${frontendUrl}/menu/${restaurantId}?table=${table.id}`;
    table.qrCode = await QRCode.toDataURL(menuUrl, { width: 256, margin: 2 });
    await table.save();

    return table;
  }

  @Authorized()
  @Mutation(() => RestaurantTable)
  async updateTable(
    @Arg("input") input: UpdateTableInput,
    @Ctx() ctx: ContextType,
  ) {
    const user = ctx.currentUser;
    if (!user) {
      throw new Error("Vous n'êtes pas connecté");
    }

    const table = await RestaurantTable.findOne({
      where: { id: input.id, restaurant: { owner: user } },
    });

    if (!table) {
      throw new Error("Table non trouvée");
    }

    if (input.number !== undefined) table.number = input.number;
    if (input.capacity !== undefined) table.capacity = input.capacity;
    if (input.status !== undefined) table.status = input.status;
    if (input.qrCode !== undefined) table.qrCode = input.qrCode;

    await table.save();
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
