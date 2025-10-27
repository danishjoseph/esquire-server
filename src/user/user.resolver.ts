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
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User[]> {
    return this.userService.create([createUserInput]);
  }

  @Mutation(() => [User])
  @Roles(UserRole.ADMIN)
  async createUsers(
    @Args('createUsersInput', { type: () => CreateUsersInput })
    { users }: CreateUsersInput,
  ) {
    return this.userService.create(users);
  }

  @Query(() => [User], { name: 'users' })
  findAll(
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
    @Args('offset', { type: () => Int, nullable: true }) offset?: number,
    @Args('search', { type: () => String, nullable: true }) search?: string,
  ) {
    return this.userService.findAll(
      limit ?? 10,
      offset ?? 0,
      search ?? undefined,
    );
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.userService.findOne(id);
  }

  @Mutation(() => User)
  @Roles(UserRole.ADMIN)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.userService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => User)
  @Roles(UserRole.ADMIN)
  removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.userService.remove(id);
  }
}
