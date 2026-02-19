import { Field, InputType, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import Restaurant from "./restaurant.entity";
import MenuItemIngredient from "./menu-item-ingredient";
import IngredientCategory from "./ingredient-category";

@ObjectType()
@Entity()
@Unique(["name", "restaurantId"])
class Ingredient extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column({ default: true })
  available: boolean;

  @Column()
  ingredientCategoryId: string;

  @Field()
  @ManyToOne(
    () => IngredientCategory,
    (ingredientCategory) => ingredientCategory.ingredients,
    { onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "ingredientCategoryId" })
  ingredientCategory: IngredientCategory;

  @Column()
  restaurantId: string;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.ingredients, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "restaurantId" })
  restaurant: Restaurant;

  @OneToMany(() => MenuItemIngredient, (link) => link.ingredient)
  menuItemLinks: MenuItemIngredient[];
}
export default Ingredient;

@InputType()
export class IngredientInput {
  @Field()
  name: string;

  @Field()
  ingredientCategoryId: string;

  @Field()
  restaurantId: string;
}

@InputType()
export class UpdateIngredientInput {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  ingredientCategoryId: string;
}
