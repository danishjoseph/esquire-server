import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';
import { Purchase } from '../../purchase/entities/purchase.entity';

@Entity('customers')
@ObjectType()
@Index('IDX_NAME', ['name'])
@Index('IDX_MOBILE', ['mobile'])
@Index('IDX_ALT_MOBILE', ['alt_mobile'])
@Index('IDX_EMAIL', ['email'])
@Index('IDX_PINCODE', ['pincode'])
@Index('IDX_DISTRICT', ['district'])
export class Customer {
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @Column({ length: 100 })
  @Field()
  name: string;

  @Column({ length: 20 })
  @Field()
  mobile: string;

  @Column({ length: 20, nullable: true })
  @Field({ nullable: true })
  alt_mobile: string;

  @Column({ length: 100, nullable: true })
  @Field({ nullable: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  @Field({ nullable: true })
  address: string;

  @Column({ length: 100, nullable: true })
  @Field({ nullable: true })
  house_office: string;

  @Column({ length: 100, nullable: true })
  @Field({ nullable: true })
  street_building: string;

  @Column({ length: 100, nullable: true })
  @Field({ nullable: true })
  area: string;

  @Column({ length: 10, nullable: true })
  @Field({ nullable: true })
  pincode: string;

  @Column({ length: 50, nullable: true })
  @Field({ nullable: true })
  district: string;

  @CreateDateColumn()
  @Field()
  created_at: Date;

  @UpdateDateColumn()
  @Field()
  updated_at: Date;

  @OneToMany(() => Purchase, (purchase) => purchase.customer, { cascade: true })
  @Field(() => [Purchase])
  purchases: Purchase[];
}
