import { IsNumber } from 'class-validator';
import { CreateCustomerInput } from './create-customer.input';
import { InputType, Field, PartialType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateCustomerInput extends PartialType(CreateCustomerInput) {
  @Field(() => Int)
  @IsNumber()
  id: number;
}
