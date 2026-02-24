import { Field, ID, ObjectType } from "type-graphql";
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
