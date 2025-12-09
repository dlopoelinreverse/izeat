import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import MenuItem from "./menu-item.entity";

@ObjectType()
@Entity()
class MenuCategory extends BaseEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => String)
  @Column({ type: "text" })
  name: string;

  @Field(() => [MenuItem])
  @OneToMany(() => MenuItem, (menuItem) => menuItem.category)
  items: MenuItem[];
}

export default MenuCategory;
