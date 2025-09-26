import { IsEnum } from 'class-validator';
import { PurchaseStatus } from '../enums/purchase-status.enum';
import { CreatePurchaseInput } from './create-purchase.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';
import { WarrantyStatus } from '../enums/warranty-status.enum';

@InputType()
export class UpdatePurchaseInput extends PartialType(CreatePurchaseInput) {
  @Field() id: number;

  @Field(() => PurchaseStatus)
  @IsEnum(PurchaseStatus)
  purchase_status: PurchaseStatus;

  @Field(() => WarrantyStatus)
  @IsEnum(WarrantyStatus)
  warranty_status: WarrantyStatus;
}
