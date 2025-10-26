import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { ProductMetrics } from './dto/product-metrics';
import { GrowthMetrics } from 'reports/reporting.service';
import { CurrentUser } from 'auth/current-user.decorator';
import { User } from 'user/entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'auth/auth.guard';
import { RolesGuard } from 'auth/roles.guard';
import { Roles } from 'auth/roles.decorator';
import { UserRole } from 'user/enums/user-role.enum';

@Resolver(() => Product)
@UseGuards(AuthGuard, RolesGuard)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Mutation(() => Product)
  createProduct(
    @Args('createProductInput') createProductInput: CreateProductInput,
    @CurrentUser() user: User,
  ) {
    return this.productService.create(createProductInput, user);
  }

  @Query(() => [Product], { name: 'products' })
  findAll(
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
    @Args('offset', { type: () => Int, nullable: true }) offset?: number,
    @Args('search', { type: () => String, nullable: true }) search?: string,
  ) {
    return this.productService.findAll(
      limit ?? 10,
      offset ?? 0,
      search ?? undefined,
    );
  }

  @Query(() => Product, { name: 'product' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.productService.findOne(id);
  }

  @Mutation(() => Product)
  updateProduct(
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
    @CurrentUser() user: User,
  ) {
    return this.productService.update(
      updateProductInput.id,
      updateProductInput,
      user,
    );
  }

  @Mutation(() => Boolean)
  @Roles(UserRole.ADMIN)
  removeProduct(@Args('id', { type: () => Int }) id: number) {
    return this.productService.remove(id);
  }

  @Query(() => ProductMetrics, { name: 'productMetrics' })
  productStatistics(): Promise<GrowthMetrics> {
    return this.productService.findMetrics();
  }
}
