import { Injectable } from '@nestjs/common';
import { CreateCustomerInput } from './dto/create-customer.input';
import { UpdateCustomerInput } from './dto/update-customer.input';
import { CustomerRepository } from './customer.respository';
import { DeleteResult, FindManyOptions, ILike, Like } from 'typeorm';
import { Customer } from './entities/customer.entity';

@Injectable()
export class CustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}

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

  async findMetrics() {
    const totalCustomers = await this.customerRepository.getTotalCustomers();
    const { monthlyGrowth, currentMonthCustomers } =
      await this.findCustomerGrowth();

    return {
      totalCustomers,
      currentMonthCustomers,
      monthlyGrowth,
    };
  }

  private async findCustomerGrowth() {
    const now = new Date();

    // Determine current month and year
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Determine last month and year
    let lastMonth: number;
    let lastMonthYear: number;

    if (currentMonth === 0) {
      // If the current month is January
      lastMonth = 11; // December
      lastMonthYear = currentYear - 1; // Previous year
    } else {
      lastMonth = currentMonth - 1;
      lastMonthYear = currentYear;
    }

    // Calculate date boundaries using extracted month and year
    const startOfCurrentMonth = new Date(currentYear, currentMonth, 1);
    const endOfCurrentMonth = new Date(currentYear, currentMonth + 1, 1);

    const startOfLastMonth = new Date(lastMonthYear, lastMonth, 1);
    const endOfLastMonth = new Date(currentYear, currentMonth, 1);

    // Retrieve customer counts
    const currentMonthCustomers =
      await this.customerRepository.getCustomersCountForPeriod(
        startOfCurrentMonth,
        endOfCurrentMonth,
      );

    const lastMonthCustomers =
      await this.customerRepository.getCustomersCountForPeriod(
        startOfLastMonth,
        endOfLastMonth,
      );

    // Calculate growth percentage
    let growth: number;

    if (lastMonthCustomers === 0) {
      growth = currentMonthCustomers > 0 ? 100 : 0;
    } else {
      growth =
        ((currentMonthCustomers - lastMonthCustomers) / lastMonthCustomers) *
        100;
    }

    return { monthlyGrowth: growth, currentMonthCustomers };
  }
}
