import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PurchaseRepository } from './purchase.respository';
import { CreatePurchaseInput } from './dto/create-purchase.input';
import { PurchaseStatus } from './enums/purchase-status.enum';
import { WarrantyStatus } from './enums/warranty-status.enum';
import { UpdatePurchaseInput } from './dto/update-purchase.input';
import {
  DataSource,
  EntityNotFoundError,
  FindManyOptions,
  FindOptionsWhere,
  Like,
  QueryRunner,
} from 'typeorm';
import { Purchase } from './entities/purchase.entity';
import { ProductService } from '../product/product.service';
import { CustomerService } from '../customer/customer.service';
import { CustomerInput } from '../customer/dto/create-customer.input';
import { ProductInput } from '../product/dto/create-product.input';
import { User } from 'user/entities/user.entity';

@Injectable()
export class PurchaseService {
  private readonly logger = new Logger(PurchaseService.name);
  constructor(
    private dataSource: DataSource,
    private readonly purchaseRepository: PurchaseRepository,
    private readonly productService: ProductService,
    private readonly customerService: CustomerService,
  ) {}

  private static readonly validWarrantyStatuses: Record<
    PurchaseStatus,
    WarrantyStatus[]
  > = {
    [PurchaseStatus.ESQUIRE]: [
      WarrantyStatus.UNDER_1YR,
      WarrantyStatus.WARRANTY_UPGRADE,
      WarrantyStatus.ASC,
      WarrantyStatus.NON_WARRANTY,
    ],
    [PurchaseStatus.NON_ESQUIRE]: [
      WarrantyStatus.ASC,
      WarrantyStatus.NON_WARRANTY,
    ],
  };

  findAll(limit: number, offset: number, search?: string, customerId?: number) {
    const queryOptions: FindManyOptions<Purchase> = {
      skip: offset,
      take: limit,
      order: { created_at: 'desc' },
      relations: ['product', 'customer'],
    };

    const whereConditions: FindOptionsWhere<Purchase>[] = [];

    if (search) {
      whereConditions.push(
        { invoice_number: Like(`%${search}%`) },
        { product: { serial_number: Like(`%${search}%`) } },
      );
    }

    if (customerId) {
      whereConditions.push({ customer: { id: customerId } });
    }

    if (whereConditions.length > 0) {
      queryOptions.where = whereConditions;
    }
    return this.purchaseRepository.find(queryOptions);
  }

  async create(input: CreatePurchaseInput, user: User) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      await queryRunner.startTransaction();
      const customer = await this.customerService.ensureCustomer(
        input?.customer as CustomerInput,
        input?.customer_id as string,
        queryRunner,
        user,
      );
      const product = await this.productService.ensureProduct(
        input?.product as ProductInput,
        input?.product_id as string,
        queryRunner,
        user,
      );
      const purchaseData = {
        ...input,
        customer,
        product,
      };
      const createdData = await this.createPurchase(
        purchaseData,
        user,
        queryRunner,
      );
      await queryRunner.commitTransaction();
      return createdData;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async createPurchase(
    createInput: Omit<CreatePurchaseInput, 'customer_id' | 'product_id'>,
    user: User,
    queryRunner?: QueryRunner,
  ) {
    const { purchase_status, warranty_status } = createInput;
    if (!this.isValidWarrantyStatus(purchase_status, warranty_status)) {
      throw new Error('Invalid warranty status for the given purchase status');
    }
    this.validateWarrantyStatusFields(createInput);
    const purchaseRepo = queryRunner
      ? queryRunner.manager.getRepository(Purchase)
      : this.purchaseRepository;
    const purchaseData = purchaseRepo.create({
      ...createInput,
      created_by: user,
      updated_by: user,
    });
    return purchaseRepo.save(purchaseData);
  }

  async update(
    id: number,
    updatePurchaseInput: UpdatePurchaseInput,
    user: User,
  ) {
    const { purchase_status, warranty_status } = updatePurchaseInput;
    if (!this.isValidWarrantyStatus(purchase_status, warranty_status)) {
      throw new Error('Invalid warranty status for the given purchase status');
    }
    this.validateWarrantyStatusFields(updatePurchaseInput);
    const existingPurchase = await this.purchaseRepository.findOne({
      where: { id },
      relations: ['product', 'customer', 'updated_by'],
    });
    if (!existingPurchase) {
      throw new NotFoundException(`Purchase with ID ${id} not found.`);
    }
    const existingCustomer = await this.customerService.findOne(
      Number(updatePurchaseInput.customer_id),
    );
    if (!existingCustomer) {
      throw new NotFoundException(`Customer with ID ${id} not found.`);
    }
    const existingProduct = await this.productService.findOne(
      Number(updatePurchaseInput.product_id),
    );
    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found.`);
    }
    this.purchaseRepository.merge(existingPurchase, updatePurchaseInput);
    existingPurchase.updated_by = user;
    return this.purchaseRepository.save(existingPurchase);
  }

  async findOne(id: number, queryRunner?: QueryRunner) {
    const purchaseRepo = queryRunner
      ? queryRunner.manager.getRepository(Purchase)
      : this.purchaseRepository;
    try {
      const entity = await purchaseRepo.findOne({
        where: { id },
        relations: ['product', 'customer'],
      });
      if (!entity) {
        throw new NotFoundException(`Purchase data with ID ${id} not found.`);
      }
      return entity;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw error;
      }
      this.logger.error(
        `Unexpected error when finding purchase with ID ${id}: ${error.message}`,
        error.stack,
      );
      throw new Error(
        `An unexpected error occurred while retrieving the product with ID ${id}.`,
      );
    }
  }

  async ensurePurchase(
    input: CreatePurchaseInput,
    purchaseId: string,
    queryRunner: QueryRunner,
    user: User,
  ): Promise<Purchase> {
    if (purchaseId) {
      const purchase = await this.findOne(Number(purchaseId), queryRunner);
      this.logger.log(`Existing Purchase found with id: ${purchase.id}`);
      return purchase;
    } else {
      const customer = await this.customerService.ensureCustomer(
        input?.customer as CustomerInput,
        input?.customer_id as string,
        queryRunner,
        user,
      );
      const product = await this.productService.ensureProduct(
        input?.product as ProductInput,
        input?.product_id as string,
        queryRunner,
        user,
      );
      const purchaseData = {
        ...input,
        customer,
        product,
      };
      const createdPurchase = await this.createPurchase(
        purchaseData,
        user,
        queryRunner,
      );
      this.logger.log(`Created new purchase with id: ${createdPurchase.id}`);
      return createdPurchase;
    }
  }

  private isValidWarrantyStatus(
    purchase_status: PurchaseStatus,
    warranty_status: WarrantyStatus,
  ): boolean {
    return (
      PurchaseService.validWarrantyStatuses[purchase_status]?.includes(
        warranty_status,
      ) ?? false
    );
  }

  private validateWarrantyStatusFields(
    input: CreatePurchaseInput | UpdatePurchaseInput,
  ): void {
    const {
      warranty_status,
      purchase_date,
      invoice_number,
      warranty_expiry,
      asc_start_date,
      asc_expiry_date,
    } = input;

    switch (warranty_status) {
      case WarrantyStatus.UNDER_1YR:
        if (!purchase_date || !invoice_number) {
          throw new Error(
            'UNDER_1YR requires a purchase_date and an invoice_number',
          );
        }
        break;
      case WarrantyStatus.WARRANTY_UPGRADE:
        if (!purchase_date || !warranty_expiry) {
          throw new Error(
            'WARRANTY_UPGRADE requires a purchase_date and a warranty_expiry',
          );
        }
        break;
      case WarrantyStatus.ASC:
        if (!asc_start_date || !asc_expiry_date) {
          throw new Error('ASC requires an asc_start_date and an asc_end_date');
        }
        break;
      case WarrantyStatus.NON_WARRANTY:
        if (
          purchase_date ||
          invoice_number ||
          warranty_expiry ||
          asc_start_date ||
          asc_expiry_date
        ) {
          throw new Error('NON_WARRANTY should not have other fields');
        }
        break;
      default:
        throw new Error('Invalid warranty status provided');
    }
  }
}
