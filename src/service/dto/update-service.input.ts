import { InputType, Field, Int } from '@nestjs/graphql';
import { TicketStatus } from '../enums/ticket-status.enum';
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { ServiceSectionName } from '../enums/service-section-name.enum';

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
}
