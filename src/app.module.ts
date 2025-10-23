import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import datasource from './typeorm.config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CustomerModule } from './customer/customer.module';
import { ProductModule } from './product/product.module';
import { ReportsModule } from './reports/reports.module';
import { UserModule } from './user/user.module';
import { ServiceModule } from './service/service.module';
import { PurchaseModule } from './purchase/purchase.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(datasource.options),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
      context: ({ req }) => ({ req }),
    }),
    CustomerModule,
    ProductModule,
    ReportsModule,
    UserModule,
    ServiceModule,
    PurchaseModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
