import { IProductRepository } from '../../../domain/repositories/IProductRepository';
import { NotFoundError } from '../../errors/AppError';

export class DeleteProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(id: string): Promise<boolean> {
    const deleted = await this.productRepository.delete(id);
    if (!deleted) {
      throw new NotFoundError('El producto que intentas eliminar no existe');
    }
    return true;
  }
}
