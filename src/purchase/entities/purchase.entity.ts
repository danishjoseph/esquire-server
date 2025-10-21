import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from '../../product/entities/product.entity';
import { Customer } from '../../customer/entities/customer.entity';
import { PurchaseStatus } from '../enums/purchase-status.enum';
import { WarrantyStatus } from '../enums/warranty-status.enum';
import { Service } from '../../service/entities/service.entity';
import { IPurchase } from 'purchase/dto/create-purchase.input';

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
export class Purchase implements IPurchase {
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @OneToMany(() => Service, (service) => service.purchase)
  services: Service[];

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

  @Field(() => String, { nullable: true })
  @Column({ type: 'date', nullable: true })
  purchase_date: Date;

  @Column({ length: 50, nullable: true })
  @Field(() => String, { nullable: true })
  invoice_number: string;

  @Column({ type: 'date', nullable: true })
  @Field(() => String, { nullable: true })
  warranty_expiry: Date;

  @Column({ type: 'date', nullable: true })
  @Field(() => String, { nullable: true })
  asc_start_date: Date;

  @Column({ type: 'date', nullable: true })
  @Field(() => String, { nullable: true })
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
