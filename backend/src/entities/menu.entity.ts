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

  @Field(() => Restaurant)
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.menus)
  @JoinColumn({ name: "restaurantId" })
  restaurant: Restaurant;

  @Field(() => [MenuItem])
  @OneToMany(() => MenuItem, (menuItem) => menuItem.menu)
  items: MenuItem[];
}

export default Menu;

@ObjectType()
export class MenuResponse extends BaseResponse {
  @Field(() => Menu, { nullable: true })
  menu?: Menu;
}
