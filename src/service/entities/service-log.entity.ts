import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IServiceLog } from '../dto/create-service-log.input';
import { Service } from './service.entity';
import { ServiceLogType } from '../enums/service-log.enum';
import { User } from '../../user/entities/user.entity';

registerEnumType(ServiceLogType, {
  name: 'ServiceLogType',
});

@ObjectType()
@Entity('service_logs')
export class ServiceLog implements IServiceLog {
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @ManyToOne(() => Service, (service) => service.service_logs)
  @Field(() => Service)
  @JoinColumn({
    name: 'service_log_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_Service_Log_Service',
  })
  service: Service;

  @Column({
    type: 'enum',
    enum: ServiceLogType,
  })
  @Field(() => ServiceLogType)
  service_log_type: ServiceLogType;

  @Column()
  @Field(() => String)
  log_description: string;

  @CreateDateColumn()
  @Field()
  created_at: Date;

  @UpdateDateColumn()
  @Field()
  updated_at: Date;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  @Field(() => User, { nullable: true })
  created_by: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'updated_by' })
  @Field(() => User, { nullable: true })
  updated_by: User;
}
