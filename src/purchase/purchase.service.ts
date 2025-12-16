import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
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
import {
  CreateCustomerInput,
  CustomerInput,
} from '../customer/dto/create-customer.input';
import {
  CreateProductInput,
  ProductInput,
} from '../product/dto/create-product.input';
import { User } from 'user/entities/user.entity';
import { FileUpload } from 'graphql-upload-minimal';
import csv from 'csv-parser';
import { ImportPurchaseInput } from './dto/import-purchase.input';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

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

  async import(file: FileUpload, user: User): Promise<boolean> {
    const stream = file.createReadStream();

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const BATCH_SIZE = 200; // recommended
    let batch: any[] = [];
    // let rowCount = 0;

    return new Promise((resolve, reject) => {
      stream
        .pipe(csv())
        .on('data', async (row) => {
          stream.pause(); // prevent overflow while processing row

          try {
            batch.push(row);
            // rowCount++;

            if (batch.length >= BATCH_SIZE) {
              await this.processBatch(batch, queryRunner, user);
              batch = [];
            }

            stream.resume();
          } catch (err) {
            reject(err);
          }
        })
        .on('end', async () => {
          try {
            if (batch.length > 0) {
              await this.processBatch(batch, queryRunner, user);
            }

            await queryRunner.commitTransaction();
            await queryRunner.release();
            resolve(true);
          } catch (err) {
            await queryRunner.rollbackTransaction();
            await queryRunner.release();
            reject(err);
          }
        })
        .on('error', async (err) => {
          await queryRunner.rollbackTransaction();
          await queryRunner.release();
          reject(err);
        });
    });
  }

  private async processBatch(
    rows: ImportPurchaseInput[],
    queryRunner: QueryRunner,
    user: User,
  ) {
    for (const r of rows) {
      const input = plainToClass(CreatePurchaseInput, {
        purchase_status: r.purchase_status,
        warranty_status: r.warranty_status,
        invoice_number: r.invoice_number,
        purchase_date: r.purchase_date ? new Date(r.purchase_date) : undefined,
        warranty_expiry: r.warranty_expiry
          ? new Date(r.warranty_expiry)
          : undefined,
        asc_start_date: r.asc_start_date
          ? new Date(r.asc_start_date)
          : undefined,
        asc_expiry_date: r.asc_expiry_date
          ? new Date(r.asc_expiry_date)
          : undefined,
      });

      const existingCustomer = await this.customerService.findOneByMobile(
        r.customer_phone,
        queryRunner,
      );
      if (existingCustomer) {
        input.customer_id = existingCustomer.id.toString();
      } else {
        input.customer = plainToClass(CreateCustomerInput, {
          name: r.customer_name,
          mobile: r.customer_phone,
          alt_mobile: r.customer_alt_mobile ?? null,
          email: r.customer_email ?? null,
          address: r.customer_address ?? null,
          house_office: r.customer_house_office ?? null,
          street_building: r.customer_street_building ?? null,
          area: r.customer_area ?? null,
          pincode: r.customer_pincode ?? null,
          district: r.customer_district ?? null,
        });
      }

      const existingProduct = await this.productService.findOneBySerialNumber(
        r.product_serial_number,
        queryRunner,
      );
      if (existingProduct) {
        input.product_id = existingProduct.id.toString();
      } else {
        input.product = plainToClass(CreateProductInput, {
          name: r.product_name,
          category: r.product_category,
          brand: r.product_brand,
          model_name: r.product_model_name,
          serial_number: r.product_serial_number,
          product_warranty: r.product_warranty,
        });
      }

      const errors = await validate(input);
      if (errors.length > 0) {
        throw new BadRequestException(errors);
      }
      await this.ensurePurchase(input, '', queryRunner, user);
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
