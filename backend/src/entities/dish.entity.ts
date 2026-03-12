import { Field, Float, InputType, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import Restaurant from "./restaurant.entity";
import DishIngredient from "./dish-ingredient.entity";
import MenuItem from "./menu-item.entity";

@ObjectType()
@Entity()
class Dish extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  description: string;

  @Field(() => Float)
  @Column({ type: "float", default: 0 })
  price: number;

  @Field()
  @Column()
  restaurantId: string;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.dishes, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "restaurantId" })
  restaurant: Restaurant;

  @Field(() => [DishIngredient])
  @OneToMany(() => DishIngredient, (link) => link.dish)
  ingredients: DishIngredient[];

  @OneToMany(() => MenuItem, (mi) => mi.dish)
  menuItems: MenuItem[];
}

export default Dish;

@InputType()
export class DishInput {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => Float)
  price: number;

  @Field()
  restaurantId: string;

  @Field(() => [String])
  ingredientsId: string[];
}

@InputType()
export class UpdateDishInput {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => Float)
  price: number;

  @Field(() => [String])
  ingredientsId: string[];
}

@ObjectType()
export class DeleteDishResponse {
  @Field()
  id: string;
}
