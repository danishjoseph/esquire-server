import { Field, Float, InputType } from '@nestjs/graphql';
import { CreateAcessoriesInput, IAcessory } from './create-accessory.input';
import {
  IsArray,
  IsEnum,
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
import {
  CreatePurchaseInput,
  PurchaseInput,
} from '../../purchase/dto/create-purchase.input';
import { CreateServiceLogInput, IServiceLog } from './create-service-log.input';

export interface IService {
  status: TicketStatus;
  service_type: ServiceType;
  service_status?: ServiceStatus;
  quotation_amount: number;
  service_charge: number;
  gst_amount: number;
  total_amount: number;
  advance_amount: number;
  product_condition: ProductCondition;
  service_logs: IServiceLog[];
  accessories?: IAcessory[];
}

interface ServiceInput extends IService {
  purchase?: PurchaseInput;
  purchase_id?: string;
}

@InputType()
export class CreateServiceInput implements ServiceInput {
  // service Input
  @Field(() => TicketStatus)
  @IsEnum(TicketStatus)
  status: TicketStatus;

  @Field(() => ServiceType)
  @IsEnum(ServiceType)
  service_type: ServiceType;

  @Field(() => ServiceStatus, { nullable: true })
  @IsEnum(ServiceStatus)
  @IsOptional()
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

  // Accessories input
  @Field(() => [CreateAcessoriesInput], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAcessoriesInput)
  accessories?: CreateAcessoriesInput[];

  @Field(() => [CreateServiceLogInput])
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateServiceLogInput)
  service_logs: CreateServiceLogInput[];

  @Field(() => CreatePurchaseInput, { nullable: true })
  @IsOptional()
  @ValidateIf((o) => !o.purchase_id)
  @ValidateNested({ each: true })
  @Type(() => CreatePurchaseInput)
  purchase?: CreatePurchaseInput;

  @Field(() => String, { nullable: true })
  @ValidateIf((o) => !o.purchase)
  @IsOptional()
  @IsString()
  purchase_id?: string;
}
