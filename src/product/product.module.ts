import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductResolver } from './product.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductRepository } from './product.respository';
import { ReportsModule } from 'reports/reports.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), ReportsModule],
  providers: [ProductRepository, ProductResolver, ProductService],
  exports: [ProductService],
})
export class ProductModule {}
