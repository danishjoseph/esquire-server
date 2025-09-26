import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { Customer } from '../../customer/entities/customer.entity';
import { PurchaseStatus } from '../enums/purchase-status.enum';
import { WarrantyStatus } from '../enums/warranty-status.enum';

registerEnumType(PurchaseStatus, {
  name: 'PurchaseStatus',
});

registerEnumType(WarrantyStatus, {
  name: 'WarrantyStatus',
});

@Entity('purchases')
@ObjectType()
@Unique(['invoice_number'])
@Index('IDX_PURCHASE_INVOICE_NUMBER', ['invoice_number'])
export class Purchase {
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @Column({
    type: 'enum',
    enum: PurchaseStatus,
  })
  @Field(() => PurchaseStatus)
  purchase_status: PurchaseStatus;

  @Column({
    type: 'enum',
    enum: WarrantyStatus,
  })
  @Field(() => WarrantyStatus)
  warranty_status: WarrantyStatus;

  @Column()
  @Field(() => Date, { nullable: true })
  purchase_date: Date;

  @Column({ length: 50 })
  @Field(() => String, { nullable: true })
  invoice_number: string;

  @Column({ nullable: true })
  @Field(() => Date, { nullable: true })
  warranty_expiry: Date;

  @Column({ nullable: true })
  @Field(() => Date, { nullable: true })
  asc_start_date: Date;

  @Column({ nullable: true })
  @Field(() => Date, { nullable: true })
  asc_expiry_date: Date;

  @ManyToOne(() => Product, (product) => product.purchases)
  @JoinColumn({ name: 'product_id' })
  @Field(() => Product)
  product: Product;

  @ManyToOne(() => Customer, (customer) => customer.purchases)
  @JoinColumn({ name: 'customer_id' })
  @Field(() => Customer)
  customer: Customer;

  @CreateDateColumn()
  @Field()
  created_at: Date;

  @UpdateDateColumn()
  @Field()
  updated_at: Date;
}
