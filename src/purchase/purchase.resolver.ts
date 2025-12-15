import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Purchase } from './entities/purchase.entity';
import { PurchaseService } from './purchase.service';
import { CreatePurchaseInput } from './dto/create-purchase.input';
import { UpdatePurchaseInput } from './dto/update-purchase.input';
import { CurrentUser } from 'auth/current-user.decorator';
import { User } from 'user/entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'auth/auth.guard';
import { RolesGuard } from 'auth/roles.guard';
import type { FileUpload } from 'graphql-upload-minimal';
import { GraphQLUpload } from 'graphql-upload-minimal';

@Resolver(() => Purchase)
@UseGuards(AuthGuard, RolesGuard)
export class PurchaseResolver {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Mutation(() => Purchase)
  createPurchase(
    @Args('createPurchaseInput') createPurchaseInput: CreatePurchaseInput,
    @CurrentUser() user: User,
  ) {
    return this.purchaseService.create(createPurchaseInput, user);
  }

  @Query(() => [Purchase], { name: 'purchases' })
  findAll(
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
    @Args('offset', { type: () => Int, nullable: true }) offset?: number,
    @Args('search', { type: () => String, nullable: true }) search?: string,
    @Args('customerId', { type: () => Int, nullable: true })
    customerId?: number,
  ) {
    return this.purchaseService.findAll(
      limit ?? 10,
      offset ?? 0,
      search ?? undefined,
      customerId ?? undefined,
    );
  }

  @Query(() => Purchase, { name: 'purchase' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.purchaseService.findOne(id);
  }

  @Mutation(() => Purchase)
  updatePurchase(
    @Args('updatePurchaseInput') updatePurchaseInput: UpdatePurchaseInput,
    @CurrentUser() user: User,
  ) {
    return this.purchaseService.update(
      updatePurchaseInput.id,
      updatePurchaseInput,
      user,
    );
  }

  @Mutation(() => Boolean)
  async import(
    @Args({ name: 'file', type: () => GraphQLUpload })
    file: FileUpload,
    @CurrentUser() user: User,
  ) {
    return this.purchaseService.import(file, user);
  }
}
