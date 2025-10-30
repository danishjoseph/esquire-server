import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Service } from 'service/entities/service.entity';

@ObjectType()
export class ServiceList {
  @Field(() => [Service])
  services: Service[];

  @Field(() => Int)
  total: number;
}
