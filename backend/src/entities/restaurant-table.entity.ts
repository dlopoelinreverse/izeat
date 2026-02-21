import { Field, InputType, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
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
  @Column()
  number: number;

  @Field(() => Number)
  @Column()
  capacity: number;

  @Field(() => String)
  @Column({ type: "text", default: "available" })
  status: string;

  @Field(() => String)
  @Column()
  restaurantId: string;

  @Field(() => String, { nullable: true })
  @Column({ type: "text", nullable: true })
  qrCode: string | null;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.tables)
  @JoinColumn({ name: "restaurantId" })
  restaurant: Restaurant;
}

export default RestaurantTable;

@InputType()
export class CreateTableInput {
  @Field(() => String)
  restaurantId: string;

  @Field(() => Number)
  number: number;

  @Field(() => Number)
  capacity: number;
}

@InputType()
export class UpdateTableInput {
  @Field(() => String)
  id: string;

  @Field(() => Number, { nullable: true })
  number?: number;

  @Field(() => Number, { nullable: true })
  capacity?: number;

  @Field(() => String, { nullable: true })
  status?: string;

  @Field(() => String, { nullable: true })
  qrCode?: string;
}
