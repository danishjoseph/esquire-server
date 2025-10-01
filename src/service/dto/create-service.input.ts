import { Field, Float, InputType } from '@nestjs/graphql';
import { ProductInput } from '../../product/dto/create-product.input';
import { PurchaseInput } from '../../product/dto/create-purchase.input';
import { ProductCategory } from 'src/product/enums/product.category.enum';
import { PurchaseStatus } from 'src/product/enums/purchase-status.enum';
import { WarrantyStatus } from 'src/product/enums/warranty-status.enum';
import { CreateAcessoriesInput, IAcessory } from './create-accessory.input';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TicketStatus } from '../enums/ticket-status.enum';
import { ServiceStatus } from '../enums/service-status.enum';
import { ProductCondition } from '../enums/product-condition.enum';
import { ServiceType } from '../enums/service-type.enum';
import { CreateCustomerInput } from 'src/customer/dto/create-customer.input';

export interface IService {
  status: TicketStatus;
  service_type: ServiceType;
  service_status: ServiceStatus;
  quotation_amount: number;
  service_charge: number;
  gst_amount: number;
  total_amount: number;
  advance_amount: number;
  product_condition: ProductCondition;
  accessories?: IAcessory[];
}

type ServiceInput = IService &
  CreateCustomerInput &
  ProductInput &
  PurchaseInput;

@InputType()
export class CreateServiceInput implements ServiceInput {
  // service Input
  @Field(() => TicketStatus)
  @IsEnum(TicketStatus)
  status: TicketStatus;

  @Field(() => ServiceType)
  @IsEnum(ServiceType)
  service_type: ServiceType;

  @Field(() => ServiceStatus)
  @IsEnum(ServiceStatus)
  service_status: ServiceStatus;

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

  @Field(() => ProductCondition)
  @IsEnum(ProductCondition)
  product_condition: ProductCondition;

  // Product Input
  @Field({ nullable: true })
  @ValidateIf((o) => !o.product_id)
  name: string;

  @Field(() => ProductCategory, { nullable: true })
  @ValidateIf((o) => !o.product_id)
  category: ProductCategory;

  @Field({ nullable: true })
  @ValidateIf((o) => !o.product_id)
  brand: string;

  @Field({ nullable: true })
  @ValidateIf((o) => !o.product_id)
  model_name: string;

  @Field({ nullable: true })
  @ValidateIf((o) => !o.product_id)
  serial_number: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  product_id: string;

  // Customer Input
  @Field({ nullable: true })
  @ValidateIf((o) => !o.customer_id)
  @IsString()
  @IsNotEmpty({
    message: 'Customer name is required if customer_id is not provided.',
  })
  customer_name: string;

  @Field({ nullable: true })
  @ValidateIf((o) => !o.customer_id)
  @IsString()
  @IsNotEmpty({ message: 'Mobile is required if customer_id is not provided.' })
  mobile: string;

  @Field({ nullable: true })
  @ValidateIf((o) => !o.customer_id)
  @IsOptional()
  @IsString()
  alt_mobile?: string;

  @Field({ nullable: true })
  @ValidateIf((o) => !o.customer_id)
  @IsOptional()
  @IsString()
  email?: string;

  @Field({ nullable: true })
  @ValidateIf((o) => !o.customer_id)
  @IsOptional()
  @IsString()
  address?: string;

  @Field({ nullable: true })
  @ValidateIf((o) => !o.customer_id)
  @IsOptional()
  @IsString()
  house_office?: string;

  @Field({ nullable: true })
  @ValidateIf((o) => !o.customer_id)
  @IsOptional()
  @IsString()
  street_building?: string;

  @Field({ nullable: true })
  @ValidateIf((o) => !o.customer_id)
  @IsOptional()
  @IsString()
  area?: string;

  @Field({ nullable: true })
  @ValidateIf((o) => !o.customer_id)
  @IsOptional()
  @IsString()
  pincode?: string;

  @Field({ nullable: true })
  @ValidateIf((o) => !o.customer_id)
  @IsOptional()
  @IsString()
  district?: string;

  @Field(() => String, { nullable: true })
  @ValidateIf((o) => !o.customer_id)
  @IsOptional()
  @IsString()
  customer_id: string;

  // Purchase Input
  @Field(() => PurchaseStatus, { nullable: true })
  @ValidateIf((o) => !o.purchase_id)
  @IsEnum(PurchaseStatus)
  purchase_status: PurchaseStatus;

  @Field(() => WarrantyStatus, { nullable: true })
  @ValidateIf((o) => !o.purchase_id)
  @IsEnum(WarrantyStatus)
  warranty_status: WarrantyStatus;

  @Field(() => Date, { nullable: true })
  @ValidateIf((o) => !o.purchase_id)
  @IsDate()
  @IsOptional()
  purchase_date: Date;

  @Field(() => String, { nullable: true })
  @ValidateIf((o) => !o.purchase_id)
  @IsString()
  @IsOptional()
  invoice_number: string;

  @Field(() => Date, { nullable: true })
  @ValidateIf((o) => !o.purchase_id)
  @IsOptional()
  @IsDate()
  warranty_expiry: Date;

  @Field(() => Date, { nullable: true })
  @ValidateIf((o) => !o.purchase_id)
  @IsOptional()
  @IsDate()
  asc_start_date: Date;

  @Field(() => Date, { nullable: true })
  @ValidateIf((o) => !o.purchase_id)
  @IsOptional()
  @IsDate()
  asc_expiry_date: Date;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  purchase_id: string;

  // Accessories input
  @Field(() => [CreateAcessoriesInput], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAcessoriesInput)
  accessories?: CreateAcessoriesInput[];
}
