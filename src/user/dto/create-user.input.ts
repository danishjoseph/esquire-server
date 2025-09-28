import { InputType, Field } from '@nestjs/graphql';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UserRole } from '../enums/user-role.enum';

export interface UserInput {
  name: string;
  mobile: string;
  role: UserRole;
}

@InputType()
export class CreateUserInput implements UserInput {
  @Field()
  @IsString()
  name: string;

  @Field()
  mobile: string;

  @Field(() => UserRole)
  @IsEnum(UserRole)
  role: UserRole;
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
