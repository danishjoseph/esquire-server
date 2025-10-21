import { Test, TestingModule } from '@nestjs/testing';
import { ServiceService } from './service.service';
import { Service } from './entities/service.entity';
import { Accessory } from './entities/accessories.entity';
import { Repository } from 'typeorm';
import { PurchaseService } from '../purchase/purchase.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TicketStatus } from './enums/ticket-status.enum';
import { Purchase } from '../purchase/entities/purchase.entity';
import { CreateServiceInput } from './dto/create-service.input';
import { DataSource } from 'typeorm';
import { ServiceRepository } from './service.respository';
import { ServiceSectionService } from './service-section.service';
import { ServiceSection } from './entities/service-section.entity';
import { ServiceLogRepository } from './service-log.respository';
import { ReportingService } from '../reports/reporting.service';

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
    findOne: jest.fn(),
  };
  const purchaseServiceMock = {
    ensurePurchase: jest.fn(),
  };

  const accessoryRepoMock = {
    create: jest.fn(),
  };

  const serviceSectionMock = {
    findOne: jest.fn(),
  };

  const serviceLogRepoMock = {
    findOne: jest.fn(),
  };

  const mockReportingService = {
    calculateGrowthForEntity: jest.fn(),
  };

  mockQueryRunner.manager.getRepository = jest.fn((entity) => {
    if (entity === Service) return serviceRepoMock;
    if (entity === Purchase) return purchaseServiceMock;
    if (entity === Accessory) return accessoryRepoMock;
  });
  let serviceRepository: jest.Mocked<Repository<Service>>;
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
          provide: PurchaseService,
          useValue: purchaseServiceMock,
        },
        {
          provide: ServiceRepository,
          useValue: serviceRepoMock,
        },
        {
          provide: ServiceLogRepository,
          useValue: serviceLogRepoMock,
        },
        {
          provide: ReportingService,
          useValue: mockReportingService,
        },
      ],
    }).compile();

    service = module.get<ServiceService>(ServiceService);
    serviceRepository = module.get(getRepositoryToken(Service));
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

    serviceRepository.create.mockReturnValue(mockCreate as Service);
    serviceRepository.save.mockResolvedValue(mockCreate as Service);
    purchaseService.ensurePurchase.mockResolvedValue({
      ...({} as unknown as Purchase),
    });

    // Call the create method and execute
    const result = await service.create({
      customerId: '1',
      accessories: [
        { accessory_name: 'Test Accessory', accessory_received: true },
      ],
    } as unknown as CreateServiceInput);

    expect(result).toEqual({ id: 1, status: TicketStatus.IN_PROGRESS });
    expect(purchaseService.ensurePurchase).toHaveBeenCalled();
    expect(serviceRepository.save).toHaveBeenCalled();
  });
});
