import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

export interface CustomerInput {
  name: string;
  mobile: string;
  alt_mobile?: string;
  email?: string;
  address?: string;
  house_office?: string;
  street_building?: string;
  area?: string;
  pincode?: string;
  district?: string;
}

@InputType()
export class CreateCustomerInput implements CustomerInput {
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
