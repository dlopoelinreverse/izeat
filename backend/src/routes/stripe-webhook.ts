import express from "express";
import Stripe from "stripe";
import Subscription from "../entities/subscription.entity";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

export const stripeWebhookRouter = express.Router();

stripeWebhookRouter.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"] as string;
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!,
      );
    } catch (err) {
      console.error("❌ Webhook signature verification failed:", err);
      res.status(400).send(`Webhook Error: ${err}`);
      return;
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode === "subscription" && session.metadata?.userId) {
          const subscription = await Subscription.findOne({
            where: { userId: session.metadata.userId },
          });
          if (subscription) {
            subscription.stripeSubscriptionId = session.subscription as string;
            subscription.status = "active";
            await subscription.save();
            console.log(`✅ Subscription activated for user ${session.metadata.userId}`);
          }
        }
        break;
      }

      case "customer.subscription.updated": {
        const stripeSubscription = event.data.object as Stripe.Subscription;
        const subscription = await Subscription.findOne({
          where: { stripeSubscriptionId: stripeSubscription.id },
        });
        if (subscription) {
          subscription.status = stripeSubscription.status;
          await subscription.save();
          console.log(`🔄 Subscription updated: ${stripeSubscription.status}`);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const stripeSubscription = event.data.object as Stripe.Subscription;
        const subscription = await Subscription.findOne({
          where: { stripeSubscriptionId: stripeSubscription.id },
        });
        if (subscription) {
          subscription.status = "canceled";
          await subscription.save();
          console.log(`❌ Subscription canceled: ${stripeSubscription.id}`);
        }
        break;
      }

      default:
        break;
    }

    res.json({ received: true });
  },
);
