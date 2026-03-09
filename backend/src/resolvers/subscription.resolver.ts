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
import Subscription from "../entities/subscription.entity";
import { ContextType } from "../types";
import Stripe from "stripe";

@ObjectType()
class CheckoutSessionResult {
  @Field(() => String)
  url: string;
}

@Resolver()
class SubscriptionResolver {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-02-25.clover",
  });

  @Authorized()
  @Mutation(() => CheckoutSessionResult)
  async createCheckoutSession(@Ctx() ctx: ContextType) {
    const user = ctx.currentUser;
    if (!user) {
      throw new Error("Vous n'êtes pas connecté");
    }

    console.log(
      "_________________________________________________________Creating checkout session for user:",
      {
        id: user.id,
        email: user.email,
      },
    );

    const frontendUrl = process.env.FRONTEND_URL ?? "http://localhost:3000";

    let subscription = await Subscription.findOne({
      where: { userId: user.id },
    });

    let customerId: string;

    if (subscription?.stripeCustomerId) {
      customerId = subscription.stripeCustomerId;
      await this.stripe.customers.update(customerId, {
        email: user.email,
        name: user.name,
      });
    } else {
      const customer = await this.stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId: user.id },
      });
      customerId = customer.id;

      if (!subscription) {
        subscription = Subscription.create({
          userId: user.id,
          stripeCustomerId: customerId,
          stripeSubscriptionId: null,
          status: "incomplete",
          currentPeriodEnd: null,
        });
      } else {
        subscription.stripeCustomerId = customerId;
      }
      await subscription.save();
    }

    const session = await this.stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID!,
          quantity: 1,
        },
      ],
      success_url: `${frontendUrl}/app/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/app/subscription`,
      metadata: { userId: user.id },
      locale: "fr",
    });

    return { url: session.url! };
  }

  @Authorized()
  @Query(() => Subscription, { nullable: true })
  async mySubscription(@Ctx() ctx: ContextType) {
    const user = ctx.currentUser;
    if (!user) {
      throw new Error("Vous n'êtes pas connecté");
    }

    return (await Subscription.findOne({ where: { userId: user.id } })) ?? null;
  }

  @Authorized()
  @Mutation(() => Subscription, { nullable: true })
  async verifyCheckoutSession(
    @Arg("sessionId", () => String) sessionId: string,
    @Ctx() ctx: ContextType,
  ) {
    const user = ctx.currentUser;
    if (!user) {
      throw new Error("Vous n'êtes pas connecté");
    }

    const session = await this.stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription"],
    });

    if (session.payment_status !== "paid" || session.mode !== "subscription") {
      return (
        (await Subscription.findOne({ where: { userId: user.id } })) ?? null
      );
    }

    const subscription = await Subscription.findOne({
      where: { userId: user.id },
    });

    if (!subscription) {
      return null;
    }

    const stripeSubscription = session.subscription as Stripe.Subscription;

    subscription.stripeSubscriptionId = stripeSubscription.id;
    subscription.status = stripeSubscription.status;
    await subscription.save();

    return subscription;
  }
}

export default SubscriptionResolver;
