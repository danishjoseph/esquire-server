import { Injectable, NotFoundException } from '@nestjs/common';
import { PurchaseRepository } from './purchase.respository';
import { CreatePurchaseInput } from './dto/create-purchase.input';
import { PurchaseStatus } from './enums/purchase-status.enum';
import { WarrantyStatus } from './enums/warranty-status.enum';
import { UpdatePurchaseInput } from './dto/update-purchase.input';
import { ProductRepository } from './product.respository';

@Injectable()
export class PurchaseService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly purchaseRepository: PurchaseRepository,
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

  async create(createInput: CreatePurchaseInput) {
    const { purchase_status, warranty_status } = createInput;
    if (!this.isValidWarrantyStatus(purchase_status, warranty_status)) {
      throw new Error('Invalid warranty status for the given purchase status');
    }
    this.validateWarrantyStatusFields(createInput);
    const existingProduct = await this.productRepository.findOneBy({
      id: Number(createInput.productId),
    });
    if (!existingProduct) {
      throw new NotFoundException(
        `Product with ID ${createInput.productId} not found.`,
      );
    }
    return this.purchaseRepository.save(createInput);
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
    const existingProduct = await this.productRepository.findOneBy({
      id: Number(updateProductInput.productId),
    });
    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found.`);
    }
    this.purchaseRepository.merge(existingPurchase, updateProductInput);
    return this.purchaseRepository.save(existingProduct);
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
