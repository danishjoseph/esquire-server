import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsString } from 'class-validator';
import { ServiceLogType } from '../enums/service-log.enum';

export interface IServiceLog {
  service_log_type: ServiceLogType;
  log_description: string;
}

type ServiceLogInput = IServiceLog;

@InputType()
export class CreateServiceLogInput implements ServiceLogInput {
  @Field(() => ServiceLogType)
  @IsEnum(ServiceLogType)
  service_log_type: ServiceLogType;

  @Field()
  @IsString()
  log_description: string;
}
