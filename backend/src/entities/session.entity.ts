import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import User from "./user.entity";

@ObjectType()
@Entity("session")
class Session extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column()
  userId: string;

  @Column({ unique: true })
  // Pas de @Field ici : le token est secret, on ne l'expose pas via GraphQL !
  token: string;

  @Field()
  @Column()
  expiresAt: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  ipAddress: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  userAgent: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.sessions)
  @JoinColumn({ name: "userId" })
  user: User;
}

export default Session;
