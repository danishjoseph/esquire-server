import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ServiceService } from './service.service';
import { Service } from './entities/service.entity';
import { CreateServiceInput } from './dto/create-service.input';
import { UpdateServiceInput } from './dto/update-service.input';
import { TicketStatus } from './enums/ticket-status.enum';
import { ServiceMetrics, ServiceStatusMetrics } from './dto/service-metrics';
import { GrowthMetrics } from 'reports/reporting.service';
import { CurrentUser } from 'auth/current-user.decorator';
import { User } from 'user/entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'auth/auth.guard';
import { RolesGuard } from 'auth/roles.guard';
import { ServiceList } from './dto/service-list';

@Resolver(() => Service)
@UseGuards(AuthGuard, RolesGuard)
export class ServiceResolver {
  constructor(private readonly serviceService: ServiceService) {}

  @Mutation(() => Service)
  createService(
    @Args('createServiceInput') createServiceInput: CreateServiceInput,
    @CurrentUser() user: User,
  ) {
    return this.serviceService.create(createServiceInput, user);
  }

  @Query(() => ServiceList, { name: 'services' })
  findAll(
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
    @Args('offset', { type: () => Int, nullable: true }) offset?: number,
    @Args('status', { type: () => TicketStatus, nullable: true })
    status?: TicketStatus,
    @Args('search', { type: () => String, nullable: true }) search?: string,
  ) {
    return this.serviceService.findAll(
      limit ?? 10,
      offset ?? 0,
      status ?? TicketStatus.IN_PROGRESS,
      search ?? undefined,
    );
  }

  @Query(() => Service, { name: 'service' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.serviceService.findOne(id);
  }

  @Mutation(() => Service)
  updateService(
    @Args('updateServiceInput') updateServiceInput: UpdateServiceInput,
    @CurrentUser() user: User,
  ) {
    return this.serviceService.update(
      updateServiceInput.id,
      updateServiceInput,
      user,
    );
  }

  @Mutation(() => Boolean)
  removeService(@Args('id', { type: () => Int }) id: number) {
    return this.serviceService.remove(id);
  }

  @Query(() => ServiceStatusMetrics, { name: 'serviceStatusMetrics' })
  serviceStatusStatistics(): Promise<ServiceStatusMetrics> {
    return this.serviceService.statistics();
  }

  @Query(() => ServiceMetrics, { name: 'serviceMetrics' })
  serviceStatistics(): Promise<GrowthMetrics> {
    return this.serviceService.findMetrics();
  }
}
