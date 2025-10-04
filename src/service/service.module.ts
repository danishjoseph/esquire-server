import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceResolver } from './service.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { ProductModule } from '../product/product.module';
import { Accessory } from './entities/accessories.entity';
import { ServiceSection } from './entities/service-section.entity';
import { ServiceRepository } from './service.respository';
import { ServiceSectionService } from './service-section.service';
import { AccessoryService } from './accessory.service';
import { ReportsModule } from 'src/reports/reports.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Accessory, ServiceSection, Service]),
    ProductModule,
    ReportsModule,
  ],
  providers: [
    ServiceRepository,
    ServiceResolver,
    ServiceService,
    ServiceSectionService,
    AccessoryService,
  ],
})
export class ServiceModule {}
