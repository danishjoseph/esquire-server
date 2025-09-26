import { Field, InputType } from '@nestjs/graphql';
import { PurchaseStatus } from '../enums/purchase-status.enum';
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { WarrantyStatus } from '../enums/warranty-status.enum';

@InputType()
export class CreatePurchaseInput {
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
  productId: string;

  @Field(() => String)
  @IsString()
  customerId: string;
}
