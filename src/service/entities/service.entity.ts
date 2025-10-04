import { ObjectType, Field, registerEnumType, Float } from '@nestjs/graphql';
import { IService } from '../dto/create-service.input';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ServiceSection } from './service-section.entity';
import { TicketStatus } from '../enums/ticket-status.enum';
import { ServiceStatus } from '../enums/service-status.enum';
import { ProductCondition } from '../enums/product-condition.enum';
import { ServiceType } from '../enums/service-type.enum';
import { Accessory } from './accessories.entity';
import { Purchase } from '../../product/entities/purchase.entity';
import { ServiceLog } from './service-log.entity';

registerEnumType(TicketStatus, {
  name: 'TicketStatus',
});

registerEnumType(ServiceStatus, {
  name: 'ServiceStatus',
});

registerEnumType(ProductCondition, {
  name: 'ProductCondition',
});

registerEnumType(ServiceType, {
  name: 'ServiceType',
});

@ObjectType()
@Entity('services')
export class Service implements IService {
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @OneToMany(() => Accessory, (accessory) => accessory.service, {
    cascade: true,
  })
  @Field(() => [Accessory])
  accessories: Accessory[];

  @OneToMany(() => ServiceLog, (service_log) => service_log.service, {
    cascade: true,
  })
  @Field(() => [ServiceLog])
  service_logs: ServiceLog[];

  @ManyToOne(() => Purchase, (purchase) => purchase.services)
  @Field(() => Purchase)
  @JoinColumn({
    name: 'purchase_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_Purchase_Service',
  })
  purchase: Purchase;

  @Field(() => ServiceSection, { nullable: true })
  @ManyToOne(() => ServiceSection, (serviceSection) => serviceSection.services)
  @JoinColumn({
    name: 'service_section_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_ServiceSection_Service',
  })
  service_section: ServiceSection;

  @Column({
    type: 'enum',
    enum: TicketStatus,
  })
  @Field(() => TicketStatus)
  status: TicketStatus;

  @Column({
    type: 'enum',
    enum: ServiceType,
  })
  @Field(() => ServiceType)
  service_type: ServiceType;

  @Column({
    type: 'enum',
    enum: ServiceStatus,
    nullable: true,
  })
  @Field(() => ServiceStatus, { nullable: true })
  service_status: ServiceStatus;

  @Index('IDX_SERVICE_CASE_ID', { unique: true })
  @Column({ length: 20 })
  @Field()
  case_id: string;

  @Column('decimal')
  @Field(() => Float)
  quotation_amount: number;

  @Column('decimal')
  @Field(() => Float)
  service_charge: number;

  @Column('decimal')
  @Field(() => Float)
  gst_amount: number;

  @Column('decimal')
  @Field(() => Float)
  total_amount: number;

  @Column('decimal')
  @Field(() => Float)
  advance_amount: number;

  @Column({
    type: 'enum',
    enum: ProductCondition,
  })
  @Field(() => ProductCondition)
  product_condition: ProductCondition;

  @CreateDateColumn()
  @Field()
  created_at: Date;

  @UpdateDateColumn()
  @Field()
  updated_at: Date;
}
