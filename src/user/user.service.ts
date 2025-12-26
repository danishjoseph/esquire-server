import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UserInput } from './dto/create-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { EntityNotFoundError, Like, QueryRunner, Repository } from 'typeorm';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  create(users: UserInput[]) {
    const userUsers = this.userRepository.create(users);
    return this.userRepository.save(userUsers);
  }

  findAll(limit: number, offset: number, search?: string) {
    return this.userRepository.find({
      skip: offset,
      take: limit,
      where: search
        ? {
            name: Like(`%${search}%`),
          }
        : undefined,
      withDeleted: true,
    });
  }

  async findOne(id: number, queryRunner?: QueryRunner) {
    const userRepo = queryRunner
      ? queryRunner.manager.getRepository(User)
      : this.userRepository;
    try {
      return userRepo.findOneByOrFail({ id });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(`User with ID ${id} not found.`);
      }
      this.logger.error(
        `Unexpected error when finding user with ID ${id}: ${error.message}`,
        error.stack,
      );
      throw new Error(
        `An unexpected error occurred while retrieving the user with ID ${id}.`,
      );
    }
  }

  async update(id: number, userInput: Partial<UserInput>) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new Error(`User with id #${id} not found.`);
    }

    this.userRepository.merge(user, userInput);
    return this.userRepository.save(user);
  }

  remove(id: number) {
    return this.userRepository.softDelete(id);
  }

  async ensureUser(input: UserInput, sub: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ sub });
    if (!user) {
      const createdUser = await this.create([input]);
      this.logger.log(`Created new user: ${createdUser[0]}`);
      return createdUser[0];
    } else {
      return this.update(user.id, input);
    }
  }

  async findOneBySub(sub: string, queryRunner?: QueryRunner) {
    const userRepo = queryRunner
      ? queryRunner.manager.getRepository(User)
      : this.userRepository;
    try {
      return userRepo.findOneBy({ sub });
    } catch (error) {
      this.logger.error(
        `Unexpected error when finding user with sub ${sub}: ${error.message}`,
        error.stack,
      );
      throw new Error(
        `An unexpected error occurred while retrieving the user with sub ${sub}.`,
      );
    }
  }
}
