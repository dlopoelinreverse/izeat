import { Authorized, Ctx, FieldResolver, Query, Resolver, Root } from "type-graphql";
import User, { Onboarding } from "../entities/user.entity";
import Restaurant from "../entities/restaurant.entity";
import { ContextType } from "../types";

@Resolver(() => User)
class UserResolver {
  @Authorized()
  @Query(() => User)
  async me(@Ctx() ctx: ContextType): Promise<User> {
    if (!ctx.currentUser) throw new Error("Vous n'êtes pas connecté");
    return ctx.currentUser;
  }

  @FieldResolver(() => Onboarding)
  async onboarding(@Root() user: User): Promise<Onboarding> {
    const restaurant = await Restaurant.findOne({
      where: { owner: { id: user.id } },
      relations: ["menus", "menus.categories", "menus.items", "tables"],
    });

    if (!restaurant) {
      return {
        hasRestaurant: false,
        hasMenu: false,
        hasCategory: false,
        hasDish: false,
        hasTable: false,
        isReady: false,
      };
    }

    const hasMenu = restaurant.menus.length > 0;
    const hasCategory = restaurant.menus.some(
      (m) => m.categories && m.categories.length > 0,
    );
    const hasDish = restaurant.menus.some(
      (m) => m.items && m.items.length > 0,
    );
    const hasTable = restaurant.tables.length > 0;

    return {
      hasRestaurant: true,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      hasMenu,
      hasCategory,
      hasDish,
      hasTable,
      isReady: hasMenu && hasCategory && hasDish && hasTable,
    };
  }
}

export default UserResolver;
