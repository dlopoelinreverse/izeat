import { Authorized, Ctx, Field, ObjectType, Query, Resolver } from "type-graphql";
import { ID } from "type-graphql";
import Restaurant from "../entities/restaurant.entity";
import { ContextType } from "../types";

@ObjectType()
export class Onboarding {
  @Field(() => Boolean) hasRestaurant: boolean;
  @Field(() => String, { nullable: true }) restaurantId?: string;
  @Field(() => String, { nullable: true }) restaurantName?: string;
  @Field(() => Boolean) hasMenu: boolean;
  @Field(() => Boolean) hasCategory: boolean;
  @Field(() => Boolean) hasDish: boolean;
  @Field(() => Boolean) hasTable: boolean;
  @Field(() => Boolean) isReady: boolean;
}

@ObjectType()
class MeResult {
  @Field(() => ID) id: string;
  @Field(() => String) name: string;
  @Field(() => Onboarding, { nullable: true }) onboarding?: Onboarding;
}

@Resolver()
class UserResolver {
  @Authorized()
  @Query(() => MeResult)
  async me(@Ctx() ctx: ContextType): Promise<MeResult> {
    if (!ctx.currentUser) throw new Error("Vous n'êtes pas connecté");

    const restaurant = await Restaurant.findOne({
      where: { owner: { id: ctx.currentUser.id } },
      relations: ["menus", "menus.categories", "menus.items", "tables"],
    });

    if (!restaurant) {
      return {
        id: ctx.currentUser.id,
        name: ctx.currentUser.name,
        onboarding: {
          hasRestaurant: false,
          hasMenu: false,
          hasCategory: false,
          hasDish: false,
          hasTable: false,
          isReady: false,
        },
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
      id: ctx.currentUser.id,
      name: ctx.currentUser.name,
      onboarding: {
        hasRestaurant: true,
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        hasMenu,
        hasCategory,
        hasDish,
        hasTable,
        isReady: hasMenu && hasCategory && hasDish && hasTable,
      },
    };
  }
}

export default UserResolver;
