import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import User from "./user.entity";

@ObjectType("UserSubscription")
@Entity()
class Subscription extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => String)
  @Column({ type: "text" })
  userId: string;

  @Field(() => String)
  @Column({ type: "text" })
  stripeCustomerId: string;

  @Field(() => String, { nullable: true })
  @Column({ type: "text", nullable: true })
  stripeSubscriptionId: string | null;

  // Mirror Stripe statuses: "incomplete" | "active" | "trialing" | "past_due" | "canceled" | "unpaid"
  @Field(() => String)
  @Column({ type: "text", default: "incomplete" })
  status: string;

  @Field(() => Date, { nullable: true })
  @Column({ type: "timestamp", nullable: true })
  currentPeriodEnd: Date | null;

  @Field(() => Date)
  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  @OneToOne(() => User, (user) => user.subscription)
  @JoinColumn({ name: "userId" })
  user: User;
}

export default Subscription;
