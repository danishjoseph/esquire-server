import { Injectable } from '@nestjs/common';
import { Service } from './entities/service.entity';
import { Between, DataSource, Repository } from 'typeorm';

@Injectable()
export class ServiceRepository extends Repository<Service> {
  constructor(dataSource: DataSource) {
    super(Service, dataSource.createEntityManager());
  }

  async getTotalServices(): Promise<number> {
    return this.count();
  }

  async getCountForPeriod(start: Date, end: Date): Promise<number> {
    return this.count({
      where: {
        created_at: Between(start, end),
      },
    });
  }
}
