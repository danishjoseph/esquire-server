import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerResolver } from './customer.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { CustomerRepository } from './customer.respository';
import { ReportsModule } from '../reports/reports.module';
import { AuthModule } from 'auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Customer]), ReportsModule, AuthModule],
  providers: [CustomerRepository, CustomerResolver, CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}
