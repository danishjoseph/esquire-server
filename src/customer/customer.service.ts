import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateCustomerInput } from './dto/create-customer.input';
import { UpdateCustomerInput } from './dto/update-customer.input';
import { CustomerRepository } from './customer.respository';
import {
  DeleteResult,
  EntityNotFoundError,
  FindManyOptions,
  ILike,
  Like,
  QueryRunner,
} from 'typeorm';
import { Customer } from './entities/customer.entity';
import { GrowthMetrics, ReportingService } from '../reports/reporting.service';
import { User } from 'user/entities/user.entity';

@Injectable()
export class CustomerService {
  private readonly logger = new Logger(CustomerService.name);
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly reportingService: ReportingService,
  ) {}

  create(
    createCustomerInput: CreateCustomerInput,
    user: User,
    queryRunner?: QueryRunner,
  ) {
    const customerRepo = queryRunner
      ? queryRunner.manager.getRepository(Customer)
      : this.customerRepository;
    const customer = customerRepo.create({
      ...createCustomerInput,
      created_by: user,
      updated_by: user,
    });
    return customerRepo.save(customer);
  }

  findAll(limit: number, offset: number, search?: string) {
    const queryOptions: FindManyOptions<Customer> = {
      skip: offset,
      take: limit,
      order: { created_at: 'desc' },
      where: [],
    };

    if (search) {
      queryOptions.where = [
        { name: ILike(`%${search}%`) },
        { mobile: Like(`%${search}%`) },
        { alt_mobile: Like(`%${search}%`) },
        { email: Like(`%${search}%`) },
        { pincode: Like(`%${search}%`) },
        { district: Like(`%${search}%`) },
      ];
    }
    return this.customerRepository.find(queryOptions);
  }

  findOne(id: number, queryRunner?: QueryRunner) {
    const customerRepo = queryRunner
      ? queryRunner.manager.getRepository(Customer)
      : this.customerRepository;
    try {
      return customerRepo.findOneByOrFail({ id });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(`Customer with ID ${id} not found.`);
      }
      this.logger.error(
        `Unexpected error when finding customer with ID ${id}: ${error.message}`,
        error.stack,
      );
      throw new Error(
        `An unexpected error occurred while retrieving the customer with ID ${id}.`,
      );
    }
  }

  async update(
    id: number,
    updateCustomerInput: UpdateCustomerInput,
    user: User,
  ) {
    const customer = await this.customerRepository.findOne({
      where: { id },
      relations: ['updated_by'],
    });

    if (!customer) {
      throw new Error('Customer not found');
    }
    this.customerRepository.merge(customer, updateCustomerInput);
    customer.updated_by = user;

    await this.customerRepository.save(customer);

    return this.findOne(id);
  }

  async remove(id: number) {
    const deleteResult: DeleteResult = await this.customerRepository.delete(id);
    return deleteResult && deleteResult.affected && deleteResult.affected > 0;
  }

  async findMetrics(): Promise<GrowthMetrics> {
    const total = await this.customerRepository.getTotalCustomers();
    const { monthlyGrowth, currentMonthCount } =
      await this.reportingService.calculateGrowthForEntity(
        this.customerRepository,
      );

    return {
      total,
      currentMonthCount,
      monthlyGrowth,
    };
  }

  async ensureCustomer(
    input: CreateCustomerInput,
    customerId: string,
    queryRunner: QueryRunner,
    user: User,
  ): Promise<Customer> {
    if (customerId) {
      const customer = await this.findOne(Number(customerId), queryRunner);
      this.logger.log(`Customer found with id: ${customer.id}`);
      return customer;
    } else {
      const createdCustomer = await this.create(input, user, queryRunner);
      this.logger.log(`Created new customer with id: ${createdCustomer.id}`);
      return createdCustomer;
    }
  }
}
