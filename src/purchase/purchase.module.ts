import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Purchase } from './entities/purchase.entity';
import { PurchaseService } from './purchase.service';
import { PurchaseRepository } from './purchase.respository';
import { PurchaseResolver } from './purchase.resolver';
import { CustomerModule } from 'customer/customer.module';
import { ProductModule } from 'product/product.module';
import { ReportsModule } from 'reports/reports.module';
import { AuthModule } from 'auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Purchase]),
    CustomerModule,
    ProductModule,
    ReportsModule,
    AuthModule,
  ],
  providers: [PurchaseService, PurchaseRepository, PurchaseResolver],
  exports: [PurchaseService],
})
export class PurchaseModule {}
