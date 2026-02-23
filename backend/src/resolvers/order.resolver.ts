import {
  Resolver,
  Subscription,
  Root,
  Arg,
  ObjectType,
  Field,
  ID,
} from "type-graphql";

export const ORDER_CREATED = "ORDER_CREATED";

@ObjectType()
export class Order {
  @Field(() => ID)
  id!: string;

  @Field()
  restaurantId!: string;

  @Field()
  tableId!: string;

  @Field()
  status!: string;

  @Field()
  createdAt!: Date;
}

interface OrderCreatedPayload {
  orderCreated: Order;
  restaurantId: string;
}

@Resolver()
class OrderResolver {
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
}

export default OrderResolver;
