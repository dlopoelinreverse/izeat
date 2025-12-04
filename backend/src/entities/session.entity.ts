import {
  Entity,
  BaseEntity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import User from "./user.entity";

@ObjectType()
@Entity()
class Session extends BaseEntity {
  @Field(() => ID)
  @PrimaryColumn("text")
  id!: string;

  @Field(() => String) // 👈 Ajout explicite requis par TypeGraphQL
  @Column({ type: "text" })
  userId!: string;

  @Field(() => String)
  @Column({ type: "text", unique: true })
  token!: string;

  @Field(() => Date)
  @Column({ type: "timestamp" })
  createdAt!: Date;

  @Field(() => Date)
  @Column({ type: "timestamp" })
  updatedAt!: Date;

  @Field(() => Date)
  @Column({ type: "timestamp" })
  expiresAt!: Date;

  @Field(() => String, { nullable: true })
  @Column({ type: "text", nullable: true })
  ipAddress?: string;

  @Field(() => String, { nullable: true })
  @Column({ type: "text", nullable: true })
  userAgent?: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.sessions)
  @JoinColumn({ name: "userId" })
  user!: User;
}

export default Session;

// import {
//   Entity,
//   BaseEntity,
//   PrimaryColumn,
//   Column,
//   ManyToOne,
//   JoinColumn,
// } from "typeorm";
// import { ObjectType, Field, ID } from "type-graphql";
// import User from "./user.entity";

// @ObjectType()
// @Entity()
// class Session extends BaseEntity {
//   @Field(() => ID)
//   @PrimaryColumn("text")
//   id!: string;

//   @Field()
//   @Column()
//   userId: string;

//   @Column({ unique: true })
//   token: string;

//   @Field()
//   @Column()
//   createdAt: Date;

//   @Field()
//   @Column()
//   updatedAt: Date;

//   @Field()
//   @Column()
//   expiresAt: Date;

//   @Field({ nullable: true })
//   @Column({ nullable: true })
//   ipAddress: string;

//   @Field({ nullable: true })
//   @Column({ nullable: true })
//   userAgent: string;

//   @Field(() => User)
//   @ManyToOne(() => User, (user) => user.sessions)
//   @JoinColumn({ name: "userId" })
//   user: User;
// }

// export default Session;
