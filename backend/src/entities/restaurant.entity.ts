import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import User from "./user.entity";
import Menu from "./menu.entity";
import RestaurantTable from "./restaurant-table.entity";
import Ingredient from "./ingredient.entity";
import IngredientCategory from "./ingredient-category";
import Dish from "./dish.entity";

@ObjectType()
@Entity()
class Restaurant extends BaseEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => String)
  @Column({ type: "text" })
  name!: string;

  @Field(() => [Menu])
  @OneToMany(() => Menu, (menu) => menu.restaurant)
  menus!: Menu[];

  @Field(() => [RestaurantTable])
  @OneToMany(() => RestaurantTable, (table) => table.restaurant)
  tables!: RestaurantTable[];

  @Field(() => String)
  @Column({ type: "text" })
  ownerId!: string;

  @ManyToOne(() => User, (user) => user.restaurants)
  @JoinColumn({ name: "ownerId" })
  owner: User;

  @Field(() => [Ingredient])
  @OneToMany(() => Ingredient, (ingredient) => ingredient.restaurant)
  ingredients: Ingredient[];

  @Field(() => [IngredientCategory])
  @OneToMany(() => IngredientCategory, (category) => category.restaurant)
  categories: IngredientCategory[];

  @Field(() => [Dish])
  @OneToMany(() => Dish, (dish) => dish.restaurant)
  dishes: Dish[];
}

export default Restaurant;
