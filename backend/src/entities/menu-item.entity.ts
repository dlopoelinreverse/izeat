import { Field, ObjectType } from "type-graphql";
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

@ObjectType()
@Entity()
class MenuItem extends BaseEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => String)
  @Column({ type: "text" })
  name: string;

  @Field(() => String)
  @Column({ type: "text" })
  menuId: string;

  @Field(() => String)
  @Column({ type: "text" })
  categoryId: string;

  @Field(() => Menu)
  @ManyToOne(() => Menu, (menu) => menu.items)
  @JoinColumn({ name: "menuId" })
  menu: Menu;

  @Field(() => MenuCategory)
  @ManyToOne(() => MenuCategory, (menuCategory) => menuCategory.items)
  @JoinColumn({ name: "categoryId" })
  category: MenuCategory;
}

export default MenuItem;
