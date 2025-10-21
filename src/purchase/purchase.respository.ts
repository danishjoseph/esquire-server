import { Injectable } from '@nestjs/common';
import { Purchase } from './entities/purchase.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class PurchaseRepository extends Repository<Purchase> {
  constructor(dataSource: DataSource) {
    super(Purchase, dataSource.createEntityManager());
  }
}
