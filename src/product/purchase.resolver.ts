import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Purchase } from './entities/purchase.entity';
import { PurchaseService } from './purchase.service';
import { UpdatePurchaseInput } from './dto/update-purchase.input';
import { CreatePurchaseInput } from './dto/create-purchase.input';

@Resolver(() => Purchase)
export class PurchaseResolver {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Mutation(() => Purchase)
  createPurchase(
    @Args('createPurchaseInput') createPurchaseInput: CreatePurchaseInput,
  ) {
    return this.purchaseService.create(createPurchaseInput);
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
