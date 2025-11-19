import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ServiceSectionCount {
  @Field()
  sectionName: string;

  @Field()
  count: number;
}
