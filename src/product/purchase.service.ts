import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PurchaseRepository } from './purchase.respository';
import { CreatePurchaseInput } from './dto/create-purchase.input';
import { PurchaseStatus } from './enums/purchase-status.enum';
import { WarrantyStatus } from './enums/warranty-status.enum';
import { UpdatePurchaseInput } from './dto/update-purchase.input';
import { EntityNotFoundError, QueryRunner } from 'typeorm';
import { Purchase } from './entities/purchase.entity';
import { ProductService } from './product.service';
import { CustomerService } from 'src/customer/customer.service';

@Injectable()
export class PurchaseService {
  private readonly logger = new Logger(PurchaseService.name);
  constructor(
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

  async create(createInput: CreatePurchaseInput, queryRunner?: QueryRunner) {
    const { purchase_status, warranty_status } = createInput;
    if (!this.isValidWarrantyStatus(purchase_status, warranty_status)) {
      throw new Error('Invalid warranty status for the given purchase status');
    }
    this.validateWarrantyStatusFields(createInput);
    // Todo: Use transaction
    const purchaseRepo = queryRunner
      ? queryRunner.manager.getRepository(Purchase)
      : this.purchaseRepository;

    const existingProduct = await this.productService.findOne(
      Number(createInput.product_id),
      queryRunner,
    );
    if (!existingProduct) {
      throw new NotFoundException(
        `Product with ID ${createInput.product_id} not found.`,
      );
    }
    const existingCustomer = await this.customerService.findOne(
      Number(createInput.customer_id),
      queryRunner,
    );
    if (!existingCustomer) {
      throw new NotFoundException(
        `Customer with ID ${createInput.product_id} not found.`,
      );
    }
    const purchaseData = purchaseRepo.create({
      ...createInput,
      product: existingProduct,
      customer: existingCustomer,
    });
    return purchaseRepo.save(purchaseData);
  }

  async update(id: number, updateProductInput: UpdatePurchaseInput) {
    const { purchase_status, warranty_status } = updateProductInput;
    if (!this.isValidWarrantyStatus(purchase_status, warranty_status)) {
      throw new Error('Invalid warranty status for the given purchase status');
    }
    this.validateWarrantyStatusFields(updateProductInput);
    const existingPurchase = await this.purchaseRepository.findOneBy({ id });
    if (!existingPurchase) {
      throw new NotFoundException(`Purchase with ID ${id} not found.`);
    }
    const existingProduct = await this.productService.findOne(
      Number(updateProductInput.product_id),
    );
    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found.`);
    }
    this.purchaseRepository.merge(existingPurchase, updateProductInput);
    return this.purchaseRepository.save(existingProduct);
  }

  async findOne(id: number, queryRunner?: QueryRunner) {
    const purchaseRepo = queryRunner
      ? queryRunner.manager.getRepository(Purchase)
      : this.purchaseRepository;
    try {
      return purchaseRepo.findOneByOrFail({ id });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(`Purchase with ID ${id} not found.`);
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
  ): Promise<Purchase> {
    if (purchaseId) {
      const purchase = await this.findOne(Number(purchaseId), queryRunner);
      this.logger.log(`Existing Purchase found with id: ${purchase.id}`);
      return purchase;
    } else {
      const createdPurchase = await this.create(input, queryRunner);
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
