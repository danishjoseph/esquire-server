import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { ProductRepository } from './product.respository';
import { Product } from './entities/product.entity';
import {
  DeleteResult,
  EntityNotFoundError,
  FindManyOptions,
  Like,
  QueryRunner,
} from 'typeorm';
import { GrowthMetrics, ReportingService } from '../reports/reporting.service';
import { User } from 'user/entities/user.entity';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly reportingService: ReportingService,
  ) {}
  async create(
    createProductInput: CreateProductInput,
    user: User,
    queryRunner?: QueryRunner,
  ) {
    const productRepo = queryRunner
      ? queryRunner.manager.getRepository(Product)
      : this.productRepository;
    const product = productRepo.create({
      ...createProductInput,
      created_by: user,
      updated_by: user,
    });
    return productRepo.save(product);
  }

  findAll(limit: number, offset: number, search?: string) {
    const queryOptions: FindManyOptions<Product> = {
      skip: offset,
      take: limit,
      order: { created_at: 'desc' },
    };

    if (search) {
      queryOptions.where = [{ serial_number: Like(`%${search}%`) }];
    }
    return this.productRepository.find(queryOptions);
  }

  async findOne(id: number, queryRunner?: QueryRunner) {
    const productRepo = queryRunner
      ? queryRunner.manager.getRepository(Product)
      : this.productRepository;
    try {
      return productRepo.findOneByOrFail({ id });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(`Product with ID ${id} not found.`);
      }
      this.logger.error(
        `Unexpected error when finding product with ID ${id}: ${error.message}`,
        error.stack,
      );
      throw new Error(
        `An unexpected error occurred while retrieving the product with ID ${id}.`,
      );
    }
  }

  async update(id: number, updateProductInput: UpdateProductInput, user: User) {
    const existingProduct = await this.productRepository.findOne({
      where: { id },
      relations: ['updated_by'],
    });

    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found.`);
    }
    this.productRepository.merge(existingProduct, updateProductInput);
    existingProduct.updated_by = user;
    return this.productRepository.save(existingProduct);
  }

  async remove(id: number) {
    const deleteResult: DeleteResult = await this.productRepository.delete(id);
    return deleteResult && deleteResult.affected && deleteResult.affected > 0;
  }

  async findMetrics(): Promise<GrowthMetrics> {
    const totalProducts = await this.productRepository.getTotalProducts();
    const { monthlyGrowth, currentMonthCount } =
      await this.reportingService.calculateGrowthForEntity(
        this.productRepository,
      );

    return {
      total: totalProducts,
      currentMonthCount,
      monthlyGrowth,
    };
  }

  async ensureProduct(
    input: CreateProductInput,
    productId: string,
    queryRunner: QueryRunner,
    user: User,
  ): Promise<Product> {
    if (productId) {
      const product = await this.findOne(Number(productId), queryRunner);
      this.logger.log(`Product found with id: ${product.id}`);
      return product;
    } else {
      const productData = {
        serial_number: input.serial_number,
        category: input.category,
        name: input.name,
        brand: input.brand,
        model_name: input.model_name,
        product_warranty: input.product_warranty,
      };
      const createdProduct = await this.create(productData, user, queryRunner);
      this.logger.log(`Created new product with id: ${createdProduct.id}`);
      return createdProduct;
    }
  }

  async findOneBySerialNumber(
    serial_number: string,
    queryRunner?: QueryRunner,
  ) {
    const productRepo = queryRunner
      ? queryRunner.manager.getRepository(Product)
      : this.productRepository;
    try {
      return productRepo.findOneBy({ serial_number });
    } catch (error) {
      this.logger.error(
        `Unexpected error when finding product with serial number ${serial_number}: ${error.message}`,
        error.stack,
      );
      throw new Error(
        `An unexpected error occurred while retrieving the product with serial number ${serial_number}.`,
      );
    }
  }
}
