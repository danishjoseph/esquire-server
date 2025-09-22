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
} from 'typeorm';
import { CustomerService } from '../customer/customer.service';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly customerService: CustomerService, // Instead of customerRepository
  ) {}
  async create(createProductInput: CreateProductInput) {
    const { customerId, ...productData } = createProductInput;
    const product = this.productRepository.create(productData);
    if (customerId) {
      const customer = await this.customerService.findOne(customerId);
      if (!customer) {
        throw new NotFoundException(
          `Customer with ID ${customerId} not found.`,
        );
      }
      product.customer = customer;
    }
    return this.productRepository.save(product);
  }

  findAll(limit: number, offset: number, search?: string) {
    const queryOptions: FindManyOptions<Product> = {
      skip: offset,
      take: limit,
      order: { created_at: 'desc' },
      where: [],
      relations: ['customer'], // Include the related 'customer'
    };

    if (search) {
      queryOptions.where = [{ serial_number: Like(`%${search}%`) }];
    }
    return this.productRepository.find(queryOptions);
  }

  async findOne(id: number) {
    try {
      return await this.productRepository.findOneByOrFail({ id });
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

  async update(id: number, updateProductInput: UpdateProductInput) {
    const { customerId, ...productData } = updateProductInput;
    const existingProduct = await this.productRepository.findOneBy({ id });
    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found.`);
    }
    this.productRepository.merge(existingProduct, productData);
    if (customerId) {
      const customer = await this.customerService.findOne(customerId);
      if (!customer) {
        throw new NotFoundException(
          `Customer with ID ${customerId} not found.`,
        );
      }
      existingProduct.customer = customer;
    }
    return this.productRepository.save(existingProduct);
  }

  async remove(id: number) {
    const deleteResult: DeleteResult = await this.productRepository.delete(id);
    return deleteResult && deleteResult.affected && deleteResult.affected > 0;
  }
}
