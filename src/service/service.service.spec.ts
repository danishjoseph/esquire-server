import { Test, TestingModule } from '@nestjs/testing';
import { ServiceService } from './service.service';
import { Service } from './entities/service.entity';
import { Accessory } from './entities/accessories.entity';
import { Repository } from 'typeorm';
import { ProductService } from '../product/product.service';
import { PurchaseService } from '../product/purchase.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TicketStatus } from './enums/ticket-status.enum';
import { Product } from '../product/entities/product.entity';
import { Purchase } from '../product/entities/purchase.entity';
import { CreateServiceInput } from './dto/create-service.input';
import { DataSource } from 'typeorm';
import { ServiceRepository } from './service.respository';
import { ServiceSectionService } from './service-section.service';
import { ServiceSection } from './entities/service-section.entity';

const mockQueryRunner = {
  connect: jest.fn(),
  startTransaction: jest.fn(),
  commitTransaction: jest.fn(),
  rollbackTransaction: jest.fn(),
  release: jest.fn(),
  manager: {
    getRepository: jest.fn(),
  },
};

describe('ServiceService', () => {
  let service: ServiceService;
  const serviceRepoMock = {
    save: jest.fn(),
    create: jest.fn(),
    count: jest.fn(),
  };
  const productRepoMock = {
    save: jest.fn(),
    create: jest.fn(),
  };
  const purchaseRepoMock = {
    save: jest.fn(),
    create: jest.fn(),
  };

  const accessoryRepoMock = {
    create: jest.fn(),
  };

  const serviceSectionMock = {
    findOne: jest.fn(),
  };

  mockQueryRunner.manager.getRepository = jest.fn((entity) => {
    if (entity === Service) return serviceRepoMock;
    if (entity === Product) return productRepoMock;
    if (entity === Purchase) return purchaseRepoMock;
    if (entity === Accessory) return accessoryRepoMock;
    // Add more repositories as necessary
  });
  let serviceRepository: jest.Mocked<Repository<Service>>;
  let productService: jest.Mocked<ProductService>;
  let purchaseService: jest.Mocked<PurchaseService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
          },
        },
        ServiceService,
        ServiceSectionService,
        {
          provide: getRepositoryToken(Service),
          useValue: serviceRepoMock,
        },
        {
          provide: getRepositoryToken(Accessory),
          useValue: accessoryRepoMock,
        },
        {
          provide: getRepositoryToken(ServiceSection),
          useValue: serviceSectionMock,
        },
        {
          provide: ProductService,
          useValue: productRepoMock,
        },
        {
          provide: PurchaseService,
          useValue: purchaseRepoMock,
        },
        {
          provide: ServiceRepository,
          useValue: serviceRepoMock,
        },
      ],
    }).compile();

    service = module.get<ServiceService>(ServiceService);
    serviceRepository = module.get(getRepositoryToken(Service));
    productService = module.get(ProductService);
    purchaseService = module.get(PurchaseService);
  });

  it('should be defined', () => {
    expect(service.create).toBeDefined();
    expect(service.update).toBeDefined();
  });

  it('should create a service successfully', async () => {
    // Setup mock behavior
    const mockCreate: Partial<Service> = {
      id: 1,
      status: TicketStatus.IN_PROGRESS,
      // other necessary properties initialized
    };
    const mockProduct: Partial<Product> = {
      id: 1,
      name: 'Sample Product',
      purchases: [],
    };

    serviceRepository.create.mockReturnValue(mockCreate as Service);
    serviceRepository.save.mockResolvedValue(mockCreate as Service);
    productService.create.mockResolvedValue(mockProduct as Product);
    purchaseService.create.mockResolvedValue({
      ...({} as unknown as Purchase),
      product_id: String(2),
      customer_id: String(1),
    });

    // Call the create method and execute
    const result = await service.create({
      customerId: '1',
      accessories: [
        { accessory_name: 'Test Accessory', accessory_received: true },
      ],
    } as unknown as CreateServiceInput);

    expect(result).toEqual({ id: 1, status: TicketStatus.IN_PROGRESS });
    expect(productService.create).toHaveBeenCalled();
    expect(purchaseService.create).toHaveBeenCalled();
    expect(serviceRepository.save).toHaveBeenCalled();
  });
});
