import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserInput, CreateUsersInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'auth/auth.guard';
import { RolesGuard } from 'auth/roles.guard';
import { Roles } from 'auth/roles.decorator';
import { UserRole } from './enums/user-role.enum';

@Resolver(() => User)
@UseGuards(AuthGuard, RolesGuard)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => [User])
  @Roles(UserRole.ADMIN)
  async createUser(@Args('input') input: CreateUserInput): Promise<User[]> {
    return this.userService.create([input]);
  }

  @Mutation(() => [User])
  @Roles(UserRole.ADMIN)
  async createUsers(
    @Args('users', { type: () => CreateUsersInput })
    { users }: CreateUsersInput,
  ) {
    return this.userService.create(users);
  }

  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.userService.findAll();
  }

  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.userService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => User)
  removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.userService.remove(id);
  }
}
