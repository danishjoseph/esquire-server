import { Field, InputType } from '@nestjs/graphql';
import { IsEnum } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';
import { ServiceSectionName } from '../enums/service-section-name.enum';

export interface IServiceSection {
  service_section_name: ServiceSectionName;
}

@InputType()
export class CreateServiceSectionInput implements IServiceSection {
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @Field(() => ServiceSectionName)
  @IsEnum(ServiceSectionName)
  service_section_name: ServiceSectionName;
}
