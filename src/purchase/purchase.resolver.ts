import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Purchase } from './entities/purchase.entity';
import { PurchaseService } from './purchase.service';
import { CreatePurchaseInput } from './dto/create-purchase.input';
import { UpdatePurchaseInput } from './dto/update-purchase.input';

@Resolver(() => Purchase)
export class PurchaseResolver {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Mutation(() => Purchase)
  createPurchase(
    @Args('createPurchaseInput') createPurchaseInput: CreatePurchaseInput,
  ) {
    return this.purchaseService.create(createPurchaseInput);
  }

  @Query(() => [Purchase], { name: 'purchases' })
  findAll(
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
    @Args('offset', { type: () => Int, nullable: true }) offset?: number,
    @Args('search', { type: () => String, nullable: true }) search?: string,
  ) {
    return this.purchaseService.findAll(
      limit ?? 10,
      offset ?? 0,
      search ?? undefined,
    );
  }

  @Query(() => Purchase, { name: 'purchase' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.purchaseService.findOne(id);
  }

  @Mutation(() => Purchase)
  updatePurchase(
    @Args('updatePurchaseInput') updatePurchaseInput: UpdatePurchaseInput,
  ) {
    return this.purchaseService.update(
      updatePurchaseInput.id,
      updatePurchaseInput,
    );
  }
}
