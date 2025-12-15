import { InputType, Field, Int, Float } from '@nestjs/graphql';
import { IsInt, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class UpdateServiceChargeInput {
  @Field(() => Int)
  @IsInt()
  id: number;

  @Field(() => Float)
  @IsNumber()
  @Type(() => Number)
  quotation_amount: number;

  @Field(() => Float)
  @IsNumber()
  @Type(() => Number)
  service_charge: number;

  @Field(() => Float)
  @IsNumber()
  @Type(() => Number)
  gst_amount: number;

  @Field(() => Float)
  @IsNumber()
  @Type(() => Number)
  total_amount: number;

  @Field(() => Float)
  @IsNumber()
  @Type(() => Number)
  advance_amount: number;
}
