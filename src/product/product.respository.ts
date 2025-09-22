import { Injectable } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { Between, DataSource, Repository } from 'typeorm';

@Injectable()
export class ProductRepository extends Repository<Product> {
  constructor(dataSource: DataSource) {
    super(Product, dataSource.createEntityManager());
  }

  async getTotalProducts(): Promise<number> {
    return this.count();
  }

  async getProductsCountForPeriod(start: Date, end: Date): Promise<number> {
    return this.count({
      where: {
        created_at: Between(start, end),
      },
    });
  }
}
