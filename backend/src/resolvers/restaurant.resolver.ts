import { Arg, Authorized, Ctx, Field, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import Restaurant from "../entities/restaurant.entity";
import { ContextType } from "../types";

@ObjectType()
export class DashboardSetupStatus {
  @Field(() => Boolean)
  hasRestaurant: boolean;

  @Field(() => String, { nullable: true })
  restaurantId?: string;

  @Field(() => String, { nullable: true })
  restaurantName?: string;

  @Field(() => Boolean)
  hasMenu: boolean;

  @Field(() => Boolean)
  hasMenuCategory: boolean;

  @Field(() => Boolean)
  hasMenuItem: boolean;

  @Field(() => Boolean)
  hasTable: boolean;

  @Field(() => Boolean)
  isFullySetup: boolean;
}

@Resolver()
class RestaurantResolver {
  @Authorized()
  @Mutation(() => Restaurant)
  async createRestaurant(
    @Arg("name", () => String) name: string,
    @Ctx() ctx: ContextType
  ) {
    if (!ctx.currentUser) {
      throw new Error("Vous n'êtes pas connecté");
    }

    const restaurant = await Restaurant.create({
      name,
      owner: ctx.currentUser,
    });

    restaurant.menus = [];
    restaurant.tables = [];

    await restaurant.save();

    return restaurant;
  }

  @Authorized()
  @Query(() => Restaurant)
  async userRestaurant(@Ctx() ctx: ContextType) {
    if (!ctx.currentUser) {
      throw new Error("Vous n'êtes pas connecté");
    }
    const restaurant = await Restaurant.findOne({
      where: { owner: { id: ctx.currentUser?.id } },
    });

    return restaurant;
  }

  @Authorized()
  @Query(() => Restaurant, { nullable: true })
  async restaurantDashboardStatus(@Ctx() ctx: ContextType) {
    if (!ctx.currentUser) {
      throw new Error("Vous n'êtes pas connecté");
    }

    const restaurant = await Restaurant.findOne({
      where: { owner: { id: ctx.currentUser?.id } },
      relations: ["menus", "tables", "menus.categories", "menus.items"],
    });

    return restaurant;
  }

  @Authorized()
  @Query(() => DashboardSetupStatus)
  async dashboardSetupStatus(@Ctx() ctx: ContextType): Promise<DashboardSetupStatus> {
    if (!ctx.currentUser) throw new Error("Vous n'êtes pas connecté");

    const restaurant = await Restaurant.findOne({
      where: { owner: { id: ctx.currentUser.id } },
      relations: ["menus", "menus.categories", "menus.items", "tables"],
    });

    if (!restaurant) {
      return { hasRestaurant: false, hasMenu: false, hasMenuCategory: false, hasMenuItem: false, hasTable: false, isFullySetup: false };
    }

    const hasMenu = restaurant.menus.length > 0;
    const hasMenuCategory = restaurant.menus.some((m) => m.categories && m.categories.length > 0);
    const hasMenuItem = restaurant.menus.some((m) => m.items && m.items.length > 0);
    const hasTable = restaurant.tables.length > 0;

    return {
      hasRestaurant: true,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      hasMenu,
      hasMenuCategory,
      hasMenuItem,
      hasTable,
      isFullySetup: hasMenu && hasMenuCategory && hasMenuItem && hasTable,
    };
  }
}

export default RestaurantResolver;
