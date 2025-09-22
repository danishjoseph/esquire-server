import { Test, TestingModule } from '@nestjs/testing';
import { ReportingService } from './reporting.service';

type MockRepository = {
  getCountForPeriod: jest.Mock;
};

describe('ReportingService', () => {
  let service: ReportingService;
  let mockRepository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReportingService],
    }).compile();

    service = module.get<ReportingService>(ReportingService);
    mockRepository = {
      getCountForPeriod: jest.fn(),
    };
  });

  it('should correctly calculate growth when there is a positive increase from last month to current month', async () => {
    mockRepository.getCountForPeriod
      .mockResolvedValueOnce(100) // Current month count
      .mockResolvedValueOnce(80); // Last month count

    const result = await service.calculateGrowthForEntity(mockRepository);
    expect(result).toEqual({
      monthlyGrowth: 25,
      currentMonthCount: 100,
    });
  });

  it('should return zero growth when there is no change', async () => {
    mockRepository.getCountForPeriod
      .mockResolvedValueOnce(100) // Current month count
      .mockResolvedValueOnce(100); // Last month count

    const result = await service.calculateGrowthForEntity(mockRepository);
    expect(result).toEqual({
      monthlyGrowth: 0,
      currentMonthCount: 100,
    });
  });

  it('should handle the edge case when last month count is zero and current month has count', async () => {
    mockRepository.getCountForPeriod
      .mockResolvedValueOnce(50) // Current month count
      .mockResolvedValueOnce(0); // Last month count

    const result = await service.calculateGrowthForEntity(mockRepository);
    expect(result).toEqual({
      monthlyGrowth: 100,
      currentMonthCount: 50,
    });
  });
});
