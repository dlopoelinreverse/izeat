import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import Session from "./session.entity";

@ObjectType()
@Entity()
class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Field()
  @Column({ default: false })
  emailVerified: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  image: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];
}

export default User;
