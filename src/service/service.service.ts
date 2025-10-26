import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateServiceInput } from './dto/create-service.input';
import { UpdateServiceInput } from './dto/update-service.input';
import { PurchaseService } from '../purchase/purchase.service';
import {
  DataSource,
  DeleteResult,
  EntityManager,
  FindManyOptions,
  Like,
} from 'typeorm';
import { Service } from './entities/service.entity';
import { Accessory } from './entities/accessories.entity';
import { QueryRunner } from 'typeorm/browser';
import dayjs from 'dayjs';
import { ServiceType } from './enums/service-type.enum';
import { ServiceRepository } from './service.respository';
import { TicketStatus } from './enums/ticket-status.enum';
import { ServiceSectionService } from './service-section.service';
import { GrowthMetrics, ReportingService } from '../reports/reporting.service';
import { NotFoundError } from 'rxjs';
import { ServiceLog } from './entities/service-log.entity';
import { ServiceLogRepository } from './service-log.respository';
import { Purchase } from 'purchase/entities/purchase.entity';
import { PurchaseInput } from 'purchase/dto/create-purchase.input';
import { User } from 'user/entities/user.entity';

const validStatusTransitions: { [key in TicketStatus]: TicketStatus[] } = {
  [TicketStatus.IN_PROGRESS]: [TicketStatus.QC],
  [TicketStatus.QC]: [TicketStatus.DELIVERY_READY],
  [TicketStatus.DELIVERY_READY]: [TicketStatus.DELIVERED],
  [TicketStatus.DELIVERED]: [TicketStatus.CLOSED],
  [TicketStatus.CLOSED]: [], // Closed is a terminal state
};

@Injectable()
export class ServiceService {
  private readonly logger = new Logger(ServiceRepository.name);
  constructor(
    private dataSource: DataSource,
    private readonly purchaseService: PurchaseService,
    private readonly serviceRepository: ServiceRepository,
    private readonly serviceSectionService: ServiceSectionService,
    private readonly reportingService: ReportingService,
    private readonly serviceLogRepository: ServiceLogRepository,
  ) {}

  async create(input: CreateServiceInput, user: User) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      await queryRunner.startTransaction();
      const purchase = await this.purchaseService.ensurePurchase(
        input?.purchase as PurchaseInput,
        input?.purchase_id as string,
        queryRunner,
        user,
      );
      const createdService = await this.createService(
        input,
        purchase,
        queryRunner,
      );

      await queryRunner.commitTransaction();
      return createdService;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  findAll(
    limit: number,
    offset: number,
    status?: TicketStatus,
    search?: string,
  ) {
    const conditions: any = {
      ...(search ? { case_id: Like(`%${search}%`) } : {}),
      ...(status != null ? { status: status } : {}),
    };

    const queryOptions: FindManyOptions<Service> = {
      skip: offset,
      take: limit,
      order: { created_at: 'desc' },
      where: conditions,
      relations: [
        'purchase',
        'purchase.product',
        'purchase.customer',
        'accessories',
        'service_section',
      ],
    };

    return this.serviceRepository.find(queryOptions);
  }

  async findOne(id: number) {
    try {
      const entity = await this.serviceRepository.findOne({
        where: { id },
        relations: [
          'purchase',
          'purchase.product',
          'purchase.customer',
          'accessories',
          'service_section',
          'service_logs',
        ],
      });
      if (!entity) {
        throw new NotFoundException(`Service ticket with ID ${id} not found.`);
      }
      return entity;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error; // Re-throw if it's our custom NotFoundException
      }
      this.logger.error(
        `Unexpected error when finding service ticket with ID ${id}: ${error.message}`,
        error.stack,
      );
      throw new Error(
        `An unexpected error occurred while retrieving the service with ID ${id}.`,
      );
    }
  }

  async update(id: number, updateServiceInput: UpdateServiceInput) {
    const {
      service_section_name,
      service_logs: serviceLogInputs,
      status,
    } = updateServiceInput;
    const existingService = await this.serviceRepository.findOne({
      where: { id },
      relations: ['service_section'],
    });
    if (!existingService) {
      throw new NotFoundException(`Service with ID ${id} not found.`);
    }

    this.validateStatusTransition(
      existingService.status,
      updateServiceInput.status,
    );
    if (existingService.service_section) {
      existingService.status = status;
    }
    const newLogs =
      serviceLogInputs?.map(({ log_description, service_log_type }) =>
        this.serviceLogRepository.create({
          service_log_type,
          log_description,
          service: existingService,
        }),
      ) || [];
    await this.serviceLogRepository.save(newLogs);
    // Check if the update includes a service section name
    if (service_section_name) {
      if (existingService.status !== TicketStatus.IN_PROGRESS) {
        throw new BadRequestException(
          `Service section name can only be updated when the service is in ${TicketStatus.IN_PROGRESS} status.`,
        );
      }
      const section =
        await this.serviceSectionService.findOne(service_section_name);

      if (!section) {
        throw new NotFoundException(
          `Service section ${updateServiceInput.service_section_name} not found.`,
        );
      }

      existingService.service_section = section;
    }

    return this.serviceRepository.save(existingService);
  }

  async remove(id: number) {
    const deleteResult: DeleteResult = await this.serviceRepository.delete(id);
    return deleteResult && deleteResult.affected && deleteResult.affected > 0;
  }

  async statistics() {
    const total = await this.serviceRepository.count();
    const pending = await this.serviceRepository.countBy({
      status: TicketStatus.IN_PROGRESS,
    });
    const solved = await this.serviceRepository.countBy({
      status: TicketStatus.CLOSED,
    });

    return {
      total,
      pending,
      solved,
    };
  }

  async findMetrics(): Promise<GrowthMetrics> {
    const totalProducts = await this.serviceRepository.getTotalServices();
    const { monthlyGrowth, currentMonthCount } =
      await this.reportingService.calculateGrowthForEntity(
        this.serviceRepository,
      );

    return {
      total: totalProducts,
      currentMonthCount,
      monthlyGrowth,
    };
  }

  private async createService(
    input: CreateServiceInput,
    purchase: Purchase,
    queryRunner: QueryRunner,
  ) {
    const accessoryRepository = queryRunner.manager.getRepository(Accessory);
    const serviceLogRepository = queryRunner.manager.getRepository(ServiceLog);
    const serviceRepository = queryRunner.manager.getRepository(Service);
    const accessories =
      input.accessories?.map((accessoryInput) =>
        accessoryRepository.create(accessoryInput),
      ) || [];

    const service_logs =
      input.service_logs?.map((serviceLogInput) =>
        serviceLogRepository.create(serviceLogInput),
      ) || [];

    const caseId = await this.generateCaseId(
      input.service_type,
      queryRunner.manager,
    );
    const serviceEntity = serviceRepository.create({
      case_id: caseId,
      status: input.status,
      service_type: input.service_type,
      service_status: input.service_status,
      quotation_amount: input.quotation_amount,
      service_charge: input.service_charge,
      gst_amount: input.gst_amount,
      total_amount: input.total_amount,
      advance_amount: input.advance_amount,
      product_condition: input.product_condition,
      accessories,
      purchase,
      service_logs,
    });
    return serviceRepository.save(serviceEntity);
  }

  private async generateCaseId(
    serviceType: ServiceType,
    manager: EntityManager,
  ): Promise<string> {
    const serviceCode = this.getServiceCode(serviceType);
    const currentMonth = dayjs().format('MMM').toUpperCase();
    const pattern = `${serviceCode}-${currentMonth}-%`;

    // Find the last entry for the current month and service type
    const lastEntry = await manager.getRepository(Service).findOne({
      where: { case_id: Like(pattern) },
      order: { case_id: 'DESC' },
    });

    let sequenceNumber = 1;
    if (lastEntry) {
      const parts = lastEntry.case_id.split('-');
      sequenceNumber = parseInt(parts[2]) + 1;
    }

    // Zero-pad the sequence number and form the new case ID
    const paddedSequence = sequenceNumber.toString().padStart(3, '0');
    return `${serviceCode}-${currentMonth}-${paddedSequence}`;
  }

  private getServiceCode(serviceType: ServiceType): string {
    switch (serviceType) {
      case ServiceType.OUTDOOR:
        return 'LC';
      case ServiceType.INHOUSE:
        return 'EA';
    }
  }

  private validateStatusTransition(
    currentStatus: string,
    newStatus?: string,
  ): void {
    if (!newStatus) return;

    const allowedTransitions = validStatusTransitions[currentStatus] || [];
    const isAllowed = allowedTransitions.includes(newStatus);

    if (!isAllowed) {
      throw new BadRequestException(
        `Transition from ${currentStatus} to ${newStatus} is not allowed.`,
      );
    }
  }
}
