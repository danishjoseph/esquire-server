import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseService } from './purchase.service';
import { PurchaseRepository } from './purchase.respository';
import { WarrantyStatus } from './enums/warranty-status.enum';
import { CreatePurchaseInput } from './dto/create-purchase.input';
import { PurchaseStatus } from './enums/purchase-status.enum';
import { UpdatePurchaseInput } from './dto/update-purchase.input';
import { ProductRepository } from './product.respository';

describe('PurchaseService', () => {
  let service: PurchaseService;
  let mockProductRepository: Partial<
    Record<keyof ProductRepository, jest.Mock>
  >;
  let mockPurchaseRepository: Partial<
    Record<keyof PurchaseRepository, jest.Mock>
  >;

  beforeEach(async () => {
    mockPurchaseRepository = {
      save: jest.fn(),
      findOneBy: jest.fn(),
      merge: jest.fn(),
    };
    mockProductRepository = {
      findOneBy: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PurchaseService,
        { provide: PurchaseRepository, useValue: mockPurchaseRepository },
        { provide: ProductRepository, useValue: mockProductRepository },
      ],
    }).compile();

    service = module.get<PurchaseService>(PurchaseService);
  });

  it('should be defined', () => {
    expect(service.create).toBeDefined();
    expect(service.update).toBeDefined();
  });

  it('should correctly validate warranty status', () => {
    expect(
      service['isValidWarrantyStatus'](
        PurchaseStatus.ESQUIRE,
        WarrantyStatus.UNDER_1YR,
      ),
    ).toBe(true);
    expect(
      service['isValidWarrantyStatus'](
        PurchaseStatus.ESQUIRE,
        WarrantyStatus.ASC,
      ),
    ).toBe(true);
    expect(
      service['isValidWarrantyStatus'](
        PurchaseStatus.NON_ESQUIRE,
        WarrantyStatus.NON_WARRANTY,
      ),
    ).toBe(true);
    expect(
      service['isValidWarrantyStatus'](
        PurchaseStatus.NON_ESQUIRE,
        WarrantyStatus.UNDER_1YR,
      ),
    ).toBe(false);
  });

  it('should validate additional fields based on warranty status', () => {
    const validInputs: { input: CreatePurchaseInput }[] = [
      {
        input: {
          productId: 'mockId',
          purchase_status: PurchaseStatus.ESQUIRE,
          warranty_status: WarrantyStatus.UNDER_1YR,
          purchase_date: new Date(),
          invoice_number: 'INV123456',
        } as CreatePurchaseInput,
      },
      {
        input: {
          productId: 'mockId',
          purchase_status: PurchaseStatus.ESQUIRE,
          warranty_status: WarrantyStatus.WARRANTY_UPGRADE,
          purchase_date: new Date(),
          warranty_expiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        } as CreatePurchaseInput,
      },
      {
        input: {
          productId: 'mockId',
          purchase_status: PurchaseStatus.ESQUIRE,
          warranty_status: WarrantyStatus.ASC,
          asc_start_date: new Date(),
          asc_expiry_date: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 months later
        } as CreatePurchaseInput,
      },
      {
        input: {
          productId: 'mockId',
          purchase_status: PurchaseStatus.ESQUIRE,
          warranty_status: WarrantyStatus.NON_WARRANTY,
        } as CreatePurchaseInput,
      },
    ];

    validInputs.forEach(({ input }) => {
      expect(() =>
        service['validateWarrantyStatusFields'](input),
      ).not.toThrow();
    });

    // Invalid test cases
    const invalidInputs: { input: CreatePurchaseInput }[] = [
      {
        input: {
          productId: 'mockId',
          purchase_status: PurchaseStatus.ESQUIRE,
          warranty_status: WarrantyStatus.UNDER_1YR,
        } as CreatePurchaseInput,
      },
      {
        input: {
          productId: 'mockId',
          purchase_status: PurchaseStatus.ESQUIRE,
          warranty_status: WarrantyStatus.WARRANTY_UPGRADE,
          purchase_date: new Date(),
        } as CreatePurchaseInput,
      },
      {
        input: {
          productId: 'mockId',
          purchase_status: PurchaseStatus.ESQUIRE,
          warranty_status: WarrantyStatus.ASC,
          asc_start_date: new Date(),
        } as CreatePurchaseInput,
      },
      {
        input: {
          productId: 'mockId',
          purchase_status: PurchaseStatus.ESQUIRE,
          warranty_status: WarrantyStatus.NON_WARRANTY,
          purchase_date: new Date(),
        } as CreatePurchaseInput,
      },
    ];

    invalidInputs.forEach(({ input }) => {
      expect(() => service['validateWarrantyStatusFields'](input)).toThrow();
    });
  });

  it('should create the purchase status', async () => {
    const input = {
      productId: 'mockId',
      purchase_status: PurchaseStatus.NON_ESQUIRE,
      warranty_status: WarrantyStatus.NON_WARRANTY,
    } as CreatePurchaseInput;
    mockProductRepository.findOneBy?.mockReturnValueOnce({
      id: input.productId,
    });
    await service.create(input);
    expect(mockPurchaseRepository.save).toHaveBeenCalledWith(input);
  });

  it('should update the existing purchase status', async () => {
    const input = {
      id: 1,
      productId: 'mockId',
      purchase_status: PurchaseStatus.NON_ESQUIRE,
      warranty_status: WarrantyStatus.NON_WARRANTY,
    } as UpdatePurchaseInput;
    mockProductRepository.findOneBy?.mockReturnValueOnce({
      id: input.productId,
    });
    mockPurchaseRepository.findOneBy?.mockReturnValueOnce({
      id: input.id,
    });
    await service.update(input.id, input);
    expect(mockPurchaseRepository.merge).toHaveBeenCalled();
    expect(mockPurchaseRepository.save).toHaveBeenCalled();
  });
});
