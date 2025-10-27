import { ObjectType, Field } from '@nestjs/graphql';
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
import { registerEnumType } from '@nestjs/graphql';
import { ProductCategory } from '../enums/product.category.enum';
import { Purchase } from '../../purchase/entities/purchase.entity';
import { User } from '../../user/entities/user.entity';

registerEnumType(ProductCategory, {
  name: 'ProductCategory',
});

@Entity('products')
@ObjectType()
@Unique(['serial_number'])
@Index('IDX_PRODUCT_SERIAL_NUMBER', ['serial_number'])
export class Product {
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @Column({ length: 100, unique: true })
  @Field()
  serial_number: string;

  @Column({
    type: 'enum',
    enum: ProductCategory,
  })
  @Field(() => ProductCategory)
  category: ProductCategory;

  @Column({ length: 100 })
  @Field()
  name: string;

  @Column({ length: 100, nullable: true })
  @Field({ nullable: true })
  brand: string;

  @Column({ length: 100, nullable: true })
  @Field({ nullable: true })
  model_name: string;

  @Column({ length: 100, nullable: true })
  @Field({ nullable: true })
  product_warranty: string;

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

  @OneToMany(() => Purchase, (purchase) => purchase.product, { cascade: true })
  @Field(() => [Purchase])
  purchases: Purchase[];
}
