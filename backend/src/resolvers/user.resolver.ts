import {
  Arg,
  Authorized,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { ID } from "type-graphql";
import Restaurant from "../entities/restaurant.entity";
import Subscription from "../entities/subscription.entity";
import { ContextType } from "../types";
import { createDemoData } from "../demo-factory";

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
  @Field(() => Boolean) hasActiveSubscription: boolean;
  @Field(() => Boolean) isDemo: boolean;
  @Field(() => Onboarding, { nullable: true }) onboarding?: Onboarding;
}

@ObjectType()
class DemoAccountResult {
  @Field(() => String) restaurantId: string;
}

@Resolver()
class UserResolver {
  @Authorized()
  @Query(() => MeResult)
  async me(@Ctx() ctx: ContextType): Promise<MeResult> {
    if (!ctx.currentUser) throw new Error("Vous n'êtes pas connecté");

    const [restaurant, subscription] = await Promise.all([
      Restaurant.findOne({
        where: { owner: { id: ctx.currentUser.id } },
        relations: ["menus", "menus.categories", "menus.items", "tables"],
      }),
      Subscription.findOne({ where: { userId: ctx.currentUser.id } }),
    ]);

    const hasActiveSubscription =
      subscription?.status === "active" || subscription?.status === "trialing";

    if (!restaurant) {
      return {
        id: ctx.currentUser.id,
        name: ctx.currentUser.name,
        hasActiveSubscription,
        isDemo: ctx.currentUser.isDemo ?? false,
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
    const hasDish = restaurant.menus.some((m) => m.items && m.items.length > 0);
    const hasTable = restaurant.tables.length > 0;

    return {
      id: ctx.currentUser.id,
      name: ctx.currentUser.name,
      hasActiveSubscription,
      isDemo: ctx.currentUser.isDemo ?? false,
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

  @Authorized()
  @Mutation(() => DemoAccountResult)
  async createDemoAccount(
    @Arg("restaurantName") restaurantName: string,
    @Ctx() ctx: ContextType,
  ): Promise<DemoAccountResult> {
    if (process.env.DEMO_MODE !== "true") {
      throw new Error("Mode démo non disponible");
    }

    const { restaurantId } = await createDemoData(ctx.currentUser!.id, restaurantName);

    return { restaurantId };
  }
}

export default UserResolver;
