import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { UserRole } from '../enums/user-role.enum';

registerEnumType(UserRole, { name: 'UserRole' });

@Entity('users')
@ObjectType()
@Unique(['sub'])
@Index('IDX_USERS_SUB', ['sub'])
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ unique: true })
  @Field()
  sub: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  name: string;

  @Column({ length: 20, nullable: true })
  @Field({ nullable: true })
  mobile: string;

  @Column({ length: 100, nullable: true })
  @Field({ nullable: true })
  email: string;

  @Column({ type: 'enum', enum: UserRole })
  @Field(() => UserRole)
  role: UserRole;

  @DeleteDateColumn()
  @Field({ nullable: true })
  deletedAt?: Date;
}
