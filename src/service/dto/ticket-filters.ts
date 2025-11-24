import { Field, ObjectType } from '@nestjs/graphql';
import { ServiceSectionName } from 'service/enums/service-section-name.enum';
import { ServiceType } from 'service/enums/service-type.enum';

// Generic filter type
@ObjectType()
export class FilterOption<TEnum> {
  @Field(() => String)
  name: TEnum;

  @Field()
  count: number;
}

@ObjectType()
class ServiceSectionFilter extends FilterOption<ServiceSectionName> {}

@ObjectType()
class ServiceTypeFilter extends FilterOption<ServiceType> {}

@ObjectType()
export class TicketFilters {
  @Field(() => [ServiceSectionFilter])
  serviceSections: { name: ServiceSectionName; count: number }[];

  @Field(() => [ServiceTypeFilter])
  serviceTypes: { name: ServiceType; count: number }[];
}
