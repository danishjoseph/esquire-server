import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CustomerService } from './customer.service';
import { Customer } from './entities/customer.entity';
import { CreateCustomerInput } from './dto/create-customer.input';
import { UpdateCustomerInput } from './dto/update-customer.input';
import { CustomerMetrics } from './dto/customer-metrics';
import { GrowthMetrics } from 'reports/reporting.service';
import { Roles } from 'auth/roles.decorator';
import { UserRole } from 'user/enums/user-role.enum';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'auth/auth.guard';
import { RolesGuard } from 'auth/roles.guard';

@Resolver(() => Customer)
@UseGuards(AuthGuard, RolesGuard)
export class CustomerResolver {
  constructor(private readonly customersService: CustomerService) {}

  @Mutation(() => Customer)
  createCustomer(
    @Args('createCustomerInput') createCustomerInput: CreateCustomerInput,
  ) {
    return this.customersService.create(createCustomerInput);
  }

  @Query(() => [Customer], { name: 'customers' })
  findAll(
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
    @Args('offset', { type: () => Int, nullable: true }) offset?: number,
    @Args('search', { type: () => String, nullable: true }) search?: string,
  ) {
    return this.customersService.findAll(
      limit ?? 10,
      offset ?? 0,
      search ?? undefined,
    );
  }

  @Query(() => Customer, { name: 'customer' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.customersService.findOne(id);
  }

  @Query(() => CustomerMetrics, { name: 'customerMetrics' })
  customerStatistics(): Promise<GrowthMetrics> {
    return this.customersService.findMetrics();
  }

  @Mutation(() => Customer)
  updateCustomer(
    @Args('updateCustomerInput') updateCustomerInput: UpdateCustomerInput,
  ) {
    return this.customersService.update(
      updateCustomerInput.id,
      updateCustomerInput,
    );
  }

  @Mutation(() => Boolean)
  @Roles(UserRole.ADMIN)
  removeCustomer(@Args('id', { type: () => Int }) id: number) {
    return this.customersService.remove(id);
  }
}
