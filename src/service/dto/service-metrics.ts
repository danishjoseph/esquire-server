import { Field, ObjectType } from '@nestjs/graphql';
import { GrowthMetrics } from 'reports/reporting.service';

@ObjectType()
export class ServiceStatusMetrics {
  @Field() total: number;
  @Field() pending: number;
  @Field() solved: number;
}

@ObjectType()
export class ServiceMetrics implements GrowthMetrics {
  @Field() total: number;
  @Field() monthlyGrowth: number;
  @Field() currentMonthCount: number;
}
