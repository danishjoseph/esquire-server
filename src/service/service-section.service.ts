import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceSection } from './entities/service-section.entity';
import { EntityNotFoundError, Repository } from 'typeorm';
import { ServiceSectionName } from './enums/service-section-name.enum';

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
}
