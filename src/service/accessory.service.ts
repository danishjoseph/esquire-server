import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Accessory } from './entities/accessories.entity';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class AccessoryService {
  constructor(
    @InjectRepository(Accessory)
    private readonly accessoryRepository: Repository<Accessory>,
  ) {}

  async remove(id: number) {
    const deleteResult: DeleteResult =
      await this.accessoryRepository.delete(id);
    return deleteResult && deleteResult.affected && deleteResult.affected > 0;
  }
}
