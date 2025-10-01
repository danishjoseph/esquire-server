import { Injectable } from '@nestjs/common';
import { Service } from './entities/service.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ServiceRepository extends Repository<Service> {
  constructor(dataSource: DataSource) {
    super(Service, dataSource.createEntityManager());
  }
}
