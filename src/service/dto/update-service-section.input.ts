import { Field, InputType, PartialType } from '@nestjs/graphql';
import { PrimaryGeneratedColumn } from 'typeorm';
import { CreateServiceSectionInput } from './create-service-section.input';

@InputType()
export class UpdateServiceSectionInput extends PartialType(
  CreateServiceSectionInput,
) {
  @PrimaryGeneratedColumn()
  @Field()
  id: number;
}
