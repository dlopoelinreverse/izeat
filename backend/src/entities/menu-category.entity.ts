import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import MenuItem from "./menu-item.entity";
import Menu from "./menu.entity";

@ObjectType()
@Entity()
class MenuCategory extends BaseEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => String)
  @Column({ type: "text" })
  name: string;

  @ManyToMany(() => MenuItem, (menuItem) => menuItem.categories)
  items: MenuItem[];

  @ManyToOne(() => Menu, (menu) => menu.categories)
  menu: Menu;
}

export default MenuCategory;
