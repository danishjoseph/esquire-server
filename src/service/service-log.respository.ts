import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ServiceLog } from './entities/service-log.entity';

@Injectable()
export class ServiceLogRepository extends Repository<ServiceLog> {
  constructor(dataSource: DataSource) {
    super(ServiceLog, dataSource.createEntityManager());
  }
}
