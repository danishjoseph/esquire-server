import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceSection } from './entities/service-section.entity';
import {
  DeleteResult,
  EntityNotFoundError,
  FindManyOptions,
  FindOperator,
  Like,
  Repository,
} from 'typeorm';
import { ServiceSectionName } from './enums/service-section-name.enum';
import { CreateServiceSectionInput } from './dto/create-service-section.input';
import { UpdateServiceSectionInput } from './dto/update-service-section.input';

@Injectable()
export class ServiceSectionService {
  private readonly logger = new Logger(ServiceSectionService.name);
  constructor(
    @InjectRepository(ServiceSection)
    private readonly serviceSectionRepository: Repository<ServiceSection>,
  ) {}

  findOne(section_name: ServiceSectionName) {
    try {
      return this.serviceSectionRepository.findOneByOrFail({
        service_section_name: section_name,
      });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(
          `Section name with name ${section_name} not found.`,
        );
      }
      this.logger.error(
        `Unexpected error when finding service section with name ${section_name}: ${error.message}`,
        error.stack,
      );
      throw new Error(
        `An unexpected error occurred while retrieving the service section details with name ${section_name}.`,
      );
    }
  }

  findAll(limit: number, offset: number, search?: string) {
    const queryOptions: FindManyOptions<ServiceSection> = {
      skip: offset,
      take: limit,
      order: { service_section_name: 'asc' },
      where: [],
    };

    if (search) {
      queryOptions.where = [
        {
          service_section_name: Like(
            `%${search}%`,
          ) as FindOperator<ServiceSectionName>,
        },
      ];
    }
    return this.serviceSectionRepository.find(queryOptions);
  }

  async create(createServiceSectionInput: CreateServiceSectionInput) {
    const section = this.serviceSectionRepository.create(
      createServiceSectionInput,
    );
    return this.serviceSectionRepository.save(section);
  }

  async update(
    id: number,
    updateServiceSectionInput: UpdateServiceSectionInput,
  ) {
    const section = await this.serviceSectionRepository.findOne({
      where: { id },
    });

    if (!section) {
      throw new NotFoundException(`ServiceSection with ID ${id} not found.`);
    }
    this.serviceSectionRepository.merge(section, updateServiceSectionInput);
    await this.serviceSectionRepository.save(section);

    return this.serviceSectionRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    const deleteResult: DeleteResult =
      await this.serviceSectionRepository.delete(id);
    return deleteResult && deleteResult.affected && deleteResult.affected > 0;
  }
}
