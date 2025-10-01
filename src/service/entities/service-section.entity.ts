import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IServiceSection } from '../dto/create-service-section.input';
import { ServiceSectionName } from '../enums/service-section-name.enum';
import { Service } from './service.entity';

registerEnumType(ServiceSectionName, {
  name: 'ServiceSectionName',
});

@ObjectType()
@Entity('service_sections')
export class ServiceSection implements IServiceSection {
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @Column({
    type: 'enum',
    enum: ServiceSectionName,
  })
  @Field(() => ServiceSectionName)
  service_section_name: ServiceSectionName;

  @OneToMany(() => Service, (service) => service.service_section)
  services: Service[];
}
