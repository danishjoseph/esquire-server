import { Injectable, Logger } from '@nestjs/common';
import { UserInput } from './dto/create-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

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

  findAll() {
    return this.userRepository.find({
      withDeleted: true,
    });
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
      // return this.update(user.id, input);
      return user;
    }
  }
}
