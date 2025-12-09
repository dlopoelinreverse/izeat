import {
  Entity,
  BaseEntity,
  PrimaryColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import Session from "./session.entity";
import Account from "./account.entity";
import Restaurant from "./restaurant.entity";

@ObjectType()
@Entity()
class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryColumn("text")
  id!: string;

  @Field(() => String) // 👈 explicit pour TypeGraphQL
  @Column({ type: "text" })
  name!: string;

  @Field(() => String)
  @Column({ type: "text", unique: true })
  email!: string;

  @Field(() => Boolean)
  @Column({ type: "boolean", default: false })
  emailVerified!: boolean;

  @Field(() => String, { nullable: true })
  @Column({ type: "text", nullable: true })
  image?: string;

  @Field(() => Date)
  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date;

  @Field(() => Date)
  @UpdateDateColumn({ type: "timestamp" })
  updatedAt!: Date;

  @Field(() => [Restaurant])
  @OneToMany(() => Restaurant, (restaurant) => restaurant.owner)
  restaurants!: Restaurant[];

  @Field(() => [Session])
  @OneToMany(() => Session, (session) => session.user)
  sessions!: Session[];

  @Field(() => [Account])
  @OneToMany(() => Account, (account) => account.user)
  accounts!: Account[];
}

export default User;
