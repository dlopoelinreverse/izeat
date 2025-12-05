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
  @OneToMany(() => Restaurant, (restaurant) => restaurant.user)
  restaurants!: Restaurant[];

  @Field(() => [Session])
  @OneToMany(() => Session, (session) => session.user)
  sessions!: Session[];

  @Field(() => [Account])
  @OneToMany(() => Account, (account) => account.user)
  accounts!: Account[];
}

export default User;

// import {
//   Entity,
//   BaseEntity,
//   PrimaryColumn,
//   Column,
//   OneToMany,
//   CreateDateColumn,
//   UpdateDateColumn,
// } from "typeorm";
// import { ObjectType, Field, ID } from "type-graphql";
// import Session from "./session.entity";

// @ObjectType()
// @Entity()
// class User extends BaseEntity {
//   @Field(() => ID)
//   @PrimaryColumn("text")
//   id!: string;

//   @Field()
//   @Column()
//   name!: string;

//   @Field()
//   @Column({ unique: true })
//   email!: string;

//   @Field()
//   @Column({ default: false })
//   emailVerified: boolean;

//   @Field({ nullable: true })
//   @Column({ nullable: true })
//   image: string;

//   @Field()
//   @CreateDateColumn()
//   createdAt: Date;

//   @Field()
//   @UpdateDateColumn()
//   updatedAt: Date;

//   @OneToMany(() => Session, (session) => session.user)
//   sessions: Session[];
// }

// export default User;
