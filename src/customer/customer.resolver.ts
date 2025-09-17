import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CustomerService } from './customer.service';
import { Customer } from './entities/customer.entity';
import { CreateCustomerInput } from './dto/create-customer.input';
import { UpdateCustomerInput } from './dto/update-customer.input';
import { CustomerMetrics } from './dto/customer-metrics';

@Resolver(() => Customer)
export class CustomerResolver {
  constructor(private readonly customersService: CustomerService) {}

  @Mutation(() => Customer)
  createCustomer(
    @Args('createCustomerInput') createCustomerInput: CreateCustomerInput,
  ) {
    return this.customersService.create(createCustomerInput);
  }

  @Query(() => [Customer], { name: 'customers' })
  findAll() {
    return this.customersService.findAll();
  }

  @Query(() => Customer, { name: 'customer' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.customersService.findOne(id);
  }

  @Query(() => CustomerMetrics, { name: 'customerMetrics' })
  customerStatistics(): Promise<CustomerMetrics> {
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
  removeCustomer(@Args('id', { type: () => Int }) id: number) {
    return this.customersService.remove(id);
  }
}
