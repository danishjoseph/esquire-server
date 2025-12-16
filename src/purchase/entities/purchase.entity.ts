import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from '../../product/entities/product.entity';
import { Customer } from '../../customer/entities/customer.entity';
import { PurchaseStatus } from '../enums/purchase-status.enum';
import { WarrantyStatus } from '../enums/warranty-status.enum';
import { Service } from '../../service/entities/service.entity';
import { IPurchase } from 'purchase/dto/create-purchase.input';
import { User } from '../../user/entities/user.entity';

registerEnumType(PurchaseStatus, {
  name: 'PurchaseStatus',
});

registerEnumType(WarrantyStatus, {
  name: 'WarrantyStatus',
});

@Entity('purchases')
@ObjectType()
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

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  @Field(() => User, { nullable: true })
  created_by: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'updated_by' })
  @Field(() => User, { nullable: true })
  updated_by: User;
}
