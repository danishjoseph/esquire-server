import { InputType, Field } from '@nestjs/graphql';
import { ProductCategory } from '../enums/product.category.enum';

@InputType()
export class CreateProductInput {
  @Field() name: string;
  @Field(() => ProductCategory) category: ProductCategory;
  @Field() brand: string;
  @Field() model_name: string;
  @Field() serial_number: string;
  @Field({ nullable: true }) customerId?: number;
}
