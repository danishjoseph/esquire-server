import { Injectable } from '@nestjs/common';
import { CreateCustomerInput } from './dto/create-customer.input';
import { UpdateCustomerInput } from './dto/update-customer.input';
import { CustomerRepository } from './customer.respository';
import { DeleteResult, FindManyOptions, ILike, Like } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { GrowthMetrics, ReportingService } from 'src/reports/reporting.service';

@Injectable()
export class CustomerService {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly reportingService: ReportingService,
  ) {}

  create(createCustomerInput: CreateCustomerInput) {
    return this.customerRepository.save(createCustomerInput);
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

  findOne(id: number) {
    return this.customerRepository.findOneBy({ id });
  }

  async update(id: number, updateCustomerInput: UpdateCustomerInput) {
    const customer = await this.customerRepository.findOne({
      where: { id },
    });

    if (!customer) {
      throw new Error('Customer not found');
    }
    this.customerRepository.merge(customer, updateCustomerInput);

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
}
