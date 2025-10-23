import { InputType, Field } from '@nestjs/graphql';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UserRole } from '../enums/user-role.enum';

export interface UserInput {
  sub: string;
  role: UserRole;
  email?: string;
  name?: string;
  mobile?: string;
}

@InputType()
export class CreateUserInput implements UserInput {
  @Field()
  @IsString()
  sub: string;

  @Field(() => UserRole)
  @IsEnum(UserRole)
  role: UserRole;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  email?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  mobile?: string;
}

@InputType()
export class CreateUsersInput {
  @Field(() => [CreateUserInput])
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayNotEmpty()
  @Type(() => CreateUserInput)
  users: CreateUserInput[];
}
