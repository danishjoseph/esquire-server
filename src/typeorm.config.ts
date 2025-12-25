import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { User } from '../src/user/entities/user.entity';
import { Product } from '../src/product/entities/product.entity';
import { Purchase } from '../src/purchase/entities/purchase.entity';
import { Service } from '../src/service/entities/service.entity';
import { Accessory } from '../src/service/entities/accessories.entity';
import { ServiceLog } from '../src/service/entities/service-log.entity';
import { ServiceSection } from '../src/service/entities/service-section.entity';
import { Customer } from '../src/customer/entities/customer.entity';
import { AddEntities1766657650243 } from '../migrations/1766657650243-add-entities';
import { InsertServiceSectionNames1766657650350 } from '../migrations/1766657650350-insert-service-section-names';

config();
const configService = new ConfigService();

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: configService.getOrThrow<string>('DB_HOST'),
  port: configService.getOrThrow<number>('DB_PORT'),
  username: configService.getOrThrow<string>('DB_USERNAME'),
  password: configService.getOrThrow<string>('DB_PASSWORD'),
  database: configService.getOrThrow<string>('DB_NAME'),
  entities: [
    User,
    Customer,
    Product,
    Purchase,
    Service,
    Accessory,
    ServiceLog,
    ServiceSection,
  ],
  migrations: [
    AddEntities1766657650243,
    InsertServiceSectionNames1766657650350,
  ],
  migrationsRun: true,
  synchronize: false,
};

export default new DataSource(dataSourceOptions);
