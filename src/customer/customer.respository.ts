import { Injectable } from '@nestjs/common';
import { Customer } from './entities/customer.entity';
import { Between, DataSource, Repository } from 'typeorm';

@Injectable()
export class CustomerRepository extends Repository<Customer> {
  constructor(dataSource: DataSource) {
    super(Customer, dataSource.createEntityManager());
  }

  async getTotalCustomers(): Promise<number> {
    return this.count();
  }

  async getCustomersCountForPeriod(start: Date, end: Date): Promise<number> {
    return this.count({
      where: {
        created_at: Between(start, end),
      },
    });
  }
}
