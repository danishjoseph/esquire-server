import { Injectable } from '@nestjs/common';
import { UserInput } from './dto/create-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
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
}
