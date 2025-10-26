import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceResolver } from './service.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { Accessory } from './entities/accessories.entity';
import { ServiceSection } from './entities/service-section.entity';
import { ServiceRepository } from './service.respository';
import { ServiceSectionService } from './service-section.service';
import { AccessoryService } from './accessory.service';
import { ReportsModule } from '../reports/reports.module';
import { ServiceLogRepository } from './service-log.respository';
import { PurchaseModule } from 'purchase/purchase.module';
import { AuthModule } from 'auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Accessory, ServiceSection, Service]),
    ReportsModule,
    PurchaseModule,
    AuthModule,
  ],
  providers: [
    ServiceRepository,
    ServiceResolver,
    ServiceService,
    ServiceSectionService,
    AccessoryService,
    ServiceLogRepository,
  ],
})
export class ServiceModule {}
