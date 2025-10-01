import { InputType, Field } from '@nestjs/graphql';
import { ProductCategory } from '../enums/product.category.enum';
import { IsEnum, IsString } from 'class-validator';

export interface ProductInput {
  name: string;
  category: ProductCategory;
  brand: string;
  model_name: string;
  serial_number: string;
}

@InputType()
export class CreateProductInput implements ProductInput {
  @Field()
  @IsString()
  name: string;

  @Field(() => ProductCategory)
  @IsEnum(ProductCategory)
  category: ProductCategory;

  @Field()
  @IsString()
  brand: string;

  @Field()
  @IsString()
  model_name: string;

  @Field()
  @IsString()
  serial_number: string;
}
