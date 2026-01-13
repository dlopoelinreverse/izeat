import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import MenuItem from "./menu-item.entity";
import Ingredient from "./ingredient.entity";

@ObjectType()
@Entity()
class MenuItemIngredient extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => MenuItem, (item) => item.ingredients, {
    onDelete: "CASCADE",
  })
  item: MenuItem;

  @Field(() => Ingredient)
  @ManyToOne(() => Ingredient, (ingredient) => ingredient.menuItemLinks, {
    eager: true,
    onDelete: "CASCADE",
  })
  ingredient: Ingredient;
}

export default MenuItemIngredient;
