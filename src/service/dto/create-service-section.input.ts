import { Field, InputType } from '@nestjs/graphql';
import { IsEnum } from 'class-validator';
import { ServiceSectionName } from '../enums/service-section-name.enum';

export interface IServiceSection {
  service_section_name: ServiceSectionName;
}

@InputType()
export class CreateServiceSectionInput implements IServiceSection {
  @Field(() => ServiceSectionName)
  @IsEnum(ServiceSectionName)
  service_section_name: ServiceSectionName;
}
