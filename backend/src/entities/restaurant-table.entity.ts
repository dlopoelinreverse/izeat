import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import Restaurant from "./restaurant.entity";

@ObjectType()
@Entity()
class RestaurantTable extends BaseEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => Number)
  @Column({ type: "int" })
  number: number;

  @Field(() => Number)
  @Column({ type: "int" })
  capacity: number;

  @Field(() => String)
  @Column({ type: "text" })
  status: string;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.tables)
  restaurant: Restaurant;
}

export default RestaurantTable;
