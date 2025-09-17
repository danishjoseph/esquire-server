import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateCustomerInput {
  @Field() name: string;
  @Field() mobile: string;
  @Field({ nullable: true }) alt_mobile?: string;
  @Field({ nullable: true }) email?: string;
  @Field({ nullable: true }) address?: string;
  @Field({ nullable: true }) house_office?: string;
  @Field({ nullable: true }) street_building?: string;
  @Field({ nullable: true }) area?: string;
  @Field({ nullable: true }) pincode?: string;
  @Field({ nullable: true }) district?: string;
}
