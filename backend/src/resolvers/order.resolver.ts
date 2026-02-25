import {
  Arg,
  Authorized,
  Ctx,
  Field,
  Float,
  ID,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
  Subscription,
} from "type-graphql";
import { Order } from "../entities/order.entity";
import pubsub from "../pubsub";
import { ContextType } from "../types";

@InputType()
class OrderItemInput {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field(() => Float)
  price: number;

  @Field(() => Int)
  qty: number;
}

export const ORDER_CREATED = "ORDER_CREATED";
export const ORDER_UPDATED = "ORDER_UPDATED";

interface OrderCreatedPayload {
  orderCreated: Order;
  restaurantId: string;
}

interface OrderUpdatedPayload {
  orderUpdated: Order;
  restaurantId: string;
}

@Resolver()
class OrderResolver {
  @Authorized()
  @Query(() => [Order])
  async getRestaurantOrders(
    @Arg("restaurantId", () => ID) restaurantId: string,
    @Ctx() ctx: ContextType,
  ): Promise<Order[]> {
    if (!ctx.currentUser) {
      throw new Error("Vous n'êtes pas connecté");
    }
    return Order.find({
      where: {
        restaurantId,
        restaurant: { owner: { id: ctx.currentUser.id } },
      },
      order: { createdAt: "ASC" },
    });
  }

  @Mutation(() => Order)
  async createOrder(
    @Arg("restaurantId", () => ID) restaurantId: string,
    @Arg("tableId", () => ID) tableId: string,
    @Arg("type", { nullable: true, defaultValue: "food" }) type: string,
    @Arg("items", () => [OrderItemInput], { nullable: true })
    items: OrderItemInput[] | null,
  ): Promise<Order> {
    const order = Order.create({
      restaurantId,
      tableId,
      status: "pending",
      type,
      items: items ?? null,
    });
    await order.save();

    pubsub.publish(ORDER_CREATED, {
      orderCreated: order,
      restaurantId,
    });

    return order;
  }

  @Authorized()
  @Mutation(() => Order)
  async updateOrderStatus(
    @Arg("orderId", () => ID) orderId: string,
    @Arg("status") status: string,
    @Ctx() ctx: ContextType,
  ): Promise<Order> {
    if (!ctx.currentUser) {
      throw new Error("Vous n'êtes pas connecté");
    }
    const order = await Order.findOneOrFail({
      where: {
        id: orderId,
        restaurant: { owner: { id: ctx.currentUser.id } },
      },
      relations: ["restaurant"],
    });
    order.status = status;
    await order.save();

    pubsub.publish(ORDER_UPDATED, {
      orderUpdated: order,
      restaurantId: order.restaurantId,
    });

    return order;
  }

  @Subscription(() => Order, {
    topics: ORDER_CREATED,
    filter: ({
      payload,
      args,
    }: {
      payload: OrderCreatedPayload;
      args: { restaurantId: string };
    }) => {
      return payload.restaurantId === args.restaurantId;
    },
  })
  orderCreated(
    @Root() payload: OrderCreatedPayload,
    @Arg("restaurantId", () => ID) _restaurantId: string,
  ): Order {
    return payload.orderCreated;
  }

  @Subscription(() => Order, {
    topics: ORDER_UPDATED,
    filter: ({
      payload,
      args,
    }: {
      payload: OrderUpdatedPayload;
      args: { restaurantId: string };
    }) => {
      return payload.restaurantId === args.restaurantId;
    },
  })
  orderUpdated(
    @Root() payload: OrderUpdatedPayload,
    @Arg("restaurantId", () => ID) _restaurantId: string,
  ): Order {
    return payload.orderUpdated;
  }
}

export default OrderResolver;
