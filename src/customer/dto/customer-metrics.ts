import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CustomerMetrics {
  @Field() totalCustomers: number;
  @Field() monthlyGrowth: number;
  @Field() currentMonthCustomers: number;
}
