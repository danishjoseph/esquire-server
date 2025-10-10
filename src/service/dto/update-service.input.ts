import { InputType, Field, Int } from '@nestjs/graphql';
import { TicketStatus } from '../enums/ticket-status.enum';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { ServiceSectionName } from '../enums/service-section-name.enum';
import { CreateServiceLogInput } from './create-service-log.input';
import { Type } from 'class-transformer';

@InputType()
export class UpdateServiceInput {
  @Field(() => Int)
  @IsInt()
  id: number;

  @Field(() => TicketStatus)
  @IsEnum(TicketStatus)
  status: TicketStatus;

  @Field(() => ServiceSectionName, { nullable: true })
  @IsEnum(ServiceSectionName)
  @IsOptional()
  service_section_name?: ServiceSectionName;

  @Field(() => [CreateServiceLogInput])
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateServiceLogInput)
  service_logs: CreateServiceLogInput[];
}
