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
import Restaurant from "./restaurant.entity";
import MenuItem from "./menu-item.entity";
import { BaseResponse } from "../common/base-response";
import MenuCategory from "./menu-category.entity";

@ObjectType()
@Entity()
class Menu extends BaseEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => String)
  @Column({ type: "text" })
  name: string;

  @Field(() => String)
  @Column({ type: "text" })
  restaurantId: string;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.menus)
  @JoinColumn({ name: "restaurantId" })
  restaurant: Restaurant;

  @Field(() => [MenuItem])
  @OneToMany(() => MenuItem, (item) => item.menu)
  items: MenuItem[];

  @Field(() => [MenuCategory])
  @OneToMany(() => MenuCategory, (category) => category.menu)
  categories: MenuCategory[];
}

export default Menu;

@ObjectType()
export class MenuResponse extends BaseResponse {
  @Field(() => Menu, { nullable: true })
  menu?: Menu;
}

@ObjectType()
export class MenusResponse extends BaseResponse {
  @Field(() => [Menu], { nullable: true })
  menus?: Menu[];
}
