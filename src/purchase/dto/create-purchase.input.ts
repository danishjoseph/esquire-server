import { Field, InputType } from '@nestjs/graphql';
import { PurchaseStatus } from '../enums/purchase-status.enum';
import {
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { WarrantyStatus } from '../enums/warranty-status.enum';
import {
  CreateCustomerInput,
  CustomerInput,
} from '../../customer/dto/create-customer.input';
import { Type } from 'class-transformer';
import {
  CreateProductInput,
  ProductInput,
} from 'product/dto/create-product.input';

export interface IPurchase {
  purchase_status: PurchaseStatus;
  warranty_status: WarrantyStatus;
  purchase_date?: Date;
  invoice_number?: string;
  warranty_expiry?: Date;
  asc_start_date?: Date;
  asc_expiry_date?: Date;
}

export interface PurchaseInput extends IPurchase {
  customer?: CustomerInput;
  customer_id?: string;
  product?: ProductInput;
  product_id?: string;
}

@InputType()
export class CreatePurchaseInput implements PurchaseInput {
  @Field(() => PurchaseStatus)
  @IsEnum(PurchaseStatus)
  purchase_status: PurchaseStatus;

  @Field(() => WarrantyStatus)
  @IsEnum(WarrantyStatus)
  warranty_status: WarrantyStatus;

  @Field(() => Date, { nullable: true })
  @IsDate()
  @IsOptional()
  purchase_date?: Date;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  invoice_number?: string;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  warranty_expiry?: Date;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  asc_start_date?: Date;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  asc_expiry_date?: Date;

  @Field(() => CreateProductInput, { nullable: true })
  @IsOptional()
  @ValidateIf((o) => !o.product_id)
  @ValidateNested({ each: true })
  @Type(() => CreateProductInput)
  product?: CreateProductInput;

  @Field(() => String, { nullable: true })
  @ValidateIf((o) => !o.product)
  @IsOptional()
  @IsString()
  product_id?: string;

  @Field(() => CreateCustomerInput, { nullable: true })
  @IsOptional()
  @ValidateIf((o) => !o.customer_id)
  @ValidateNested({ each: true })
  @Type(() => CreateCustomerInput)
  customer?: CreateCustomerInput;

  @Field(() => String, { nullable: true })
  @ValidateIf((o) => !o.customer)
  @IsOptional()
  @IsString()
  customer_id?: string;
}
