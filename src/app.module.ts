import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import datasource from './typeorm.config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'; // Import statements for driver
import { CustomerModule } from './customer/customer.module';
import { ProductModule } from './product/product.module';
import { ReportsModule } from './reports/reports.module';
import { UserModule } from './user/user.module';
import { ServiceModule } from './service/service.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(datasource.options),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
    }),
    CustomerModule,
    ProductModule,
    ReportsModule,
    UserModule,
    ServiceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
