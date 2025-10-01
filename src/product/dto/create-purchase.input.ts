import { Field, InputType } from '@nestjs/graphql';
import { PurchaseStatus } from '../enums/purchase-status.enum';
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { WarrantyStatus } from '../enums/warranty-status.enum';

export interface PurchaseInput {
  purchase_status: PurchaseStatus;
  warranty_status: WarrantyStatus;
  purchase_date?: Date;
  invoice_number?: string;
  warranty_expiry?: Date;
  asc_start_date?: Date;
  asc_expiry_date?: Date;
  product_id: string;
  customer_id: string;
}

@InputType()
export class CreatePurchaseInput implements PurchaseInput {
  @Field(() => PurchaseStatus)
  @IsEnum(PurchaseStatus)
  purchase_status: PurchaseStatus;

  @Field(() => WarrantyStatus)
  @IsEnum(WarrantyStatus)
  warranty_status: WarrantyStatus;

  @Field()
  @Field(() => Date, { nullable: true })
  @IsDate()
  @IsOptional()
  purchase_date: Date;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  invoice_number: string;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  warranty_expiry: Date;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  asc_start_date: Date;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  asc_expiry_date: Date;

  @Field(() => String)
  @IsString()
  product_id: string;

  @Field(() => String)
  @IsString()
  customer_id: string;
}
