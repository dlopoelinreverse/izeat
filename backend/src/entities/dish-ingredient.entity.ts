import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Dish from "./dish.entity";
import Ingredient from "./ingredient.entity";

@ObjectType()
@Entity()
class DishIngredient extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Dish, (dish) => dish.ingredients, {
    onDelete: "CASCADE",
  })
  dish: Dish;

  @Field(() => Ingredient)
  @ManyToOne(() => Ingredient, (ingredient) => ingredient.dishLinks, {
    eager: true,
    onDelete: "CASCADE",
  })
  ingredient: Ingredient;
}

export default DishIngredient;
