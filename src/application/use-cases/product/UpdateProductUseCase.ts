import { IProductRepository } from '../../../domain/repositories/IProductRepository';
import { Product } from '../../../domain/entities/Product';
import { UpdateProductDTO } from '../../dtos/ProductDTO';
import { NotFoundError } from '../../errors/AppError';

export class UpdateProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(id: string, dto: UpdateProductDTO): Promise<Product> {
    const updated = await this.productRepository.update(id, dto);
    if (!updated) {
      throw new NotFoundError('El producto que intentas actualizar no existe');
    }
    return updated;
  }
}
