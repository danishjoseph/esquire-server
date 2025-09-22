import { Field, ObjectType } from '@nestjs/graphql';
import { GrowthMetrics } from '../../reports/reporting.service';

@ObjectType()
export class ProductMetrics implements GrowthMetrics {
  @Field() total: number;
  @Field() monthlyGrowth: number;
  @Field() currentMonthCount: number;
}
