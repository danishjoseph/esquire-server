import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductResolver } from './product.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductRepository } from './product.respository';
import { CustomerModule } from '../customer/customer.module';
import { ReportsModule } from '../reports/reports.module';
import { PurchaseService } from './purchase.service';
import { PurchaseRepository } from './purchase.respository';
import { PurchaseResolver } from './purchase.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), CustomerModule, ReportsModule],
  providers: [
    ProductRepository,
    ProductResolver,
    ProductService,
    PurchaseService,
    PurchaseRepository,
    PurchaseResolver,
  ],
  exports: [PurchaseService],
})
export class ProductModule {}
