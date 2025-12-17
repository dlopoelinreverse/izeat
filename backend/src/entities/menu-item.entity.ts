import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import Menu from "./menu.entity";
import MenuCategory from "./menu-category.entity";

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

  @ManyToMany(() => MenuCategory, (category) => category.items)
  @JoinTable()
  categories: MenuCategory[];
}

export default MenuItem;
