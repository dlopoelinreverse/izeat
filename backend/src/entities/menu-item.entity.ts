import { Field, Float, InputType, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import Menu from "./menu.entity";
import MenuCategory from "./menu-category.entity";
import Dish from "./dish.entity";

@ObjectType()
@Entity()
class MenuItem extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column({ nullable: true })
  dishId: string;

  @Field()
  @Column()
  menuId: string;

  @Field()
  @Column()
  categoryId: string;

  @Field(() => Float, { nullable: true })
  @Column({ type: "float", nullable: true })
  priceOverride: number | null;

  @Field(() => Dish)
  @ManyToOne(() => Dish, (dish) => dish.menuItems, { onDelete: "CASCADE" })
  @JoinColumn({ name: "dishId" })
  dish: Dish;

  @ManyToOne(() => Menu, (menu) => menu.items, { onDelete: "CASCADE" })
  @JoinColumn({ name: "menuId" })
  menu: Menu;

  @ManyToOne(() => MenuCategory, (category) => category.items)
  @JoinColumn({ name: "categoryId" })
  category: MenuCategory;
}

export default MenuItem;

@InputType()
export class MenuItemInput {
  @Field()
  dishId: string;

  @Field()
  menuId: string;

  @Field()
  categoryId: string;

  @Field(() => Float, { nullable: true })
  priceOverride?: number | null;
}

@InputType()
export class CreateDishAndMenuItemInput {
  @Field()
  name: string;

  @Field()
  restaurantId: string;

  @Field()
  menuId: string;

  @Field()
  categoryId: string;

  @Field(() => [String])
  ingredientsId: string[];

  @Field()
  description: string;

  @Field(() => Float)
  price: number;
}

@ObjectType()
export class DeleteMenuItemResponse {
  @Field()
  id: string;
}
