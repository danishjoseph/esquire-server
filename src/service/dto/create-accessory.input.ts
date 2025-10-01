import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsString } from 'class-validator';

export interface IAcessory {
  accessory_name: string;
  accessory_received: boolean;
}

@InputType()
export class CreateAcessoriesInput implements IAcessory {
  @Field()
  @IsString()
  accessory_name: string;

  @Field(() => Boolean)
  @IsBoolean()
  accessory_received: boolean;
}
