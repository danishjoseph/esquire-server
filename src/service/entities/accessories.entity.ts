import { ObjectType, Field, Int } from '@nestjs/graphql';
import { IAcessory } from '../dto/create-accessory.input';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Service } from './service.entity';

@ObjectType()
@Entity('accessories')
export class Accessory implements IAcessory {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  accessory_name: string;

  @ManyToOne(() => Service, (service) => service.accessories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'service_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_Service_Accessory',
  })
  @Field(() => Service)
  service: Service;

  @Column()
  @Field(() => Boolean)
  accessory_received: boolean;

  @CreateDateColumn()
  @Field()
  created_at: Date;
}
