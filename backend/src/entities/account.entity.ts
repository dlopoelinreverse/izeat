import {
  Entity,
  BaseEntity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import User from "./user.entity";

@ObjectType()
@Entity()
class Account extends BaseEntity {
  @Field(() => ID)
  @PrimaryColumn("text")
  id!: string;

  @Field(() => String)
  @Column({ type: "text" })
  accountId!: string;

  @Field(() => String)
  @Column({ type: "text" })
  providerId!: string;

  @Field(() => String)
  @Column({ type: "text" })
  userId!: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.accounts, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user!: User;

  @Field(() => String, { nullable: true })
  @Column({ type: "text", nullable: true })
  accessToken?: string;

  @Field(() => String, { nullable: true })
  @Column({ type: "text", nullable: true })
  refreshToken?: string;

  @Field(() => String, { nullable: true })
  @Column({ type: "text", nullable: true })
  idToken?: string;

  @Field(() => Date, { nullable: true })
  @Column({ type: "timestamp", nullable: true })
  accessTokenExpiresAt?: Date;

  @Field(() => Date, { nullable: true })
  @Column({ type: "timestamp", nullable: true })
  refreshTokenExpiresAt?: Date;

  @Field(() => String, { nullable: true })
  @Column({ type: "text", nullable: true })
  scope?: string;

  @Field(() => String, { nullable: true })
  @Column({ type: "text", nullable: true })
  password?: string;

  @Field(() => Date)
  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date;

  @Field(() => Date)
  @UpdateDateColumn({ type: "timestamp" })
  updatedAt!: Date;
}

export default Account;
