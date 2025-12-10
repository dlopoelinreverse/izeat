import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
export class BaseResponse {
  @Field(() => Int)
  code: number;

  @Field()
  success: boolean;

  @Field(() => String, { nullable: true })
  message?: string;
}
