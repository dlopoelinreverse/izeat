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
import Menu from "./menu.entity";
import MenuCategory from "./menu-category.entity";
import MenuItemIngredient from "./menu-item-ingredient";

@ObjectType()
@Entity()
class MenuItem extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  menuId: string;

  @ManyToOne(() => Menu, (menu) => menu.items)
  @JoinColumn({ name: "menuId" })
  menu: Menu;

  @Field(() => [MenuItemIngredient])
  @OneToMany(() => MenuItemIngredient, (link) => link.item)
  ingredients: MenuItemIngredient[];

  @Field()
  @Column()
  categoryId: string;

  @OneToMany(() => MenuCategory, (category) => category.items)
  @JoinColumn({ name: "categoryId" })
  category: MenuCategory;
}

export default MenuItem;
