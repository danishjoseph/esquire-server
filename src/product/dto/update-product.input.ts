import { IsNumber } from 'class-validator';
import { CreateProductInput, ProductInput } from './create-product.input';
import { InputType, Field, PartialType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateProductInput
  extends PartialType(CreateProductInput)
  implements Partial<ProductInput>
{
  @Field(() => Int)
  @IsNumber()
  id: number;
}
