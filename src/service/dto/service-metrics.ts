import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ServiceMetrics {
  @Field() total: number;
  @Field() pending: number;
  @Field() solved: number;
}
