import { IProductRepository } from '../../../domain/repositories/IProductRepository';
import { PaginatedResult, PaginationParams, Product } from '../../../domain/entities/Product';

export class GetProductsUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(params: PaginationParams): Promise<PaginatedResult<Product>> {
    return this.productRepository.findAll(params);
  }
}
