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

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);
  constructor(private readonly productRepository: ProductRepository) {}
  create(createProductInput: CreateProductInput) {
    return this.productRepository.save(createProductInput);
  }

  findAll(limit: number, offset: number, search?: string) {
    const queryOptions: FindManyOptions<Product> = {
      skip: offset,
      take: limit,
      order: { created_at: 'desc' },
      where: [],
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
    try {
      const product = await this.productRepository.findOneByOrFail({ id });
      this.productRepository.merge(product, updateProductInput);
      await this.productRepository.save(product);
      return this.findOne(id);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(`Product with ID ${id} not found.`);
      }

      this.logger.error(
        `Unexpected error when updating product with ID ${id}: ${error.message}`,
        error.stack,
      );
      throw new Error(
        `An unexpected error occurred while updating the product with ID ${id}.`,
      );
    }
  }

  async remove(id: number) {
    const deleteResult: DeleteResult = await this.productRepository.delete(id);
    return deleteResult && deleteResult.affected && deleteResult.affected > 0;
  }
}
