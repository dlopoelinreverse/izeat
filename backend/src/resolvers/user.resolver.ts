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
import { auth } from "../lib/auth";
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

  @Mutation(() => DemoAccountResult)
  async createDemoAccount(
    @Arg("email") email: string,
    @Arg("restaurantName") restaurantName: string,
    @Ctx() ctx: ContextType,
  ): Promise<DemoAccountResult> {
    if (process.env.DEMO_MODE !== "true") {
      throw new Error("Mode démo non disponible");
    }

    // Random password — the visitor won't need it
    const password =
      Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);

    // Create user + session via Better Auth (creates user, account, session in DB)
    const response = await auth.api.signUpEmail({
      body: { email, password, name: email.split("@")[0] },
      asResponse: true,
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(
        (body as { message?: string }).message ??
          "Impossible de créer le compte démo",
      );
    }

    // Get userId from Better Auth response
    const responseBody = (await response.clone().json()) as {
      user?: { id: string };
    };
    const userId = responseBody?.user?.id;
    if (!userId) throw new Error("User ID manquant dans la réponse Better Auth");

    // Transfer Set-Cookie headers from Better Auth to the client
    const setCookies = response.headers.getSetCookie?.() ?? [];
    setCookies.forEach((cookie: string) => ctx.res.append("Set-Cookie", cookie));

    // Generate all demo data
    const { restaurantId } = await createDemoData(userId, restaurantName);

    return { restaurantId };
  }
}

export default UserResolver;
