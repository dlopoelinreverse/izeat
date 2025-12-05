import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import User from "./user.entity";
import Menu from "./menu.entity";

@ObjectType()
@Entity()
class Restaurant extends BaseEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => String)
  @Column({ type: "text" })
  name: string;

  @Field(() => Menu)
  @OneToMany(() => Menu, (menu) => menu.restaurant)
  menus: Menu[];

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.restaurants)
  user: User;
}

export default Restaurant;
