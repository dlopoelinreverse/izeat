import { Field, Float, ID, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import Restaurant from "./restaurant.entity";
import RestaurantTable from "./restaurant-table.entity";

@ObjectType()
export class OrderItemSnapshot {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field(() => Float)
  price: number;

  @Field(() => Int)
  qty: number;
}

@ObjectType()
@Entity()
export class Order extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => String)
  @Column()
  restaurantId: string;

  @Field(() => String)
  @Column()
  tableId: string;

  @Field(() => String)
  @Column({ type: "text", default: "pending" })
  status: string;

  @Field(() => String)
  @Column({ default: "food" })
  type: string;

  @Field(() => [OrderItemSnapshot], { nullable: true })
  @Column({ type: "jsonb", nullable: true })
  items: OrderItemSnapshot[] | null;

  @Field(() => Date)
  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @ManyToOne(() => Restaurant, { onDelete: "CASCADE" })
  @JoinColumn({ name: "restaurantId" })
  restaurant: Restaurant;

  @ManyToOne(() => RestaurantTable, { onDelete: "CASCADE" })
  @JoinColumn({ name: "tableId" })
  table: RestaurantTable;
}
