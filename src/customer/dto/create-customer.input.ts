import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateCustomerInput {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  mobile: string;

  @Field({ nullable: true })
  @IsOptional()
  alt_mobile?: string;

  @Field({ nullable: true })
  @IsOptional()
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  address?: string;

  @Field({ nullable: true })
  @IsOptional()
  house_office?: string;

  @Field({ nullable: true })
  @IsOptional()
  street_building?: string;

  @Field({ nullable: true })
  @IsOptional()
  area?: string;

  @Field({ nullable: true })
  @IsOptional()
  pincode?: string;

  @Field({ nullable: true })
  @IsOptional()
  district?: string;
}
