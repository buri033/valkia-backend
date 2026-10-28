import { IProductRepository } from '../../../domain/repositories/IProductRepository';
import { Product } from '../../../domain/entities/Product';
import { CreateProductDTO } from '../../dtos/ProductDTO';
import { BadRequestError } from '../../errors/AppError';

export class CreateProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(dto: CreateProductDTO): Promise<Product> {
    if (!dto.name || dto.name.trim().length < 2) {
      throw new BadRequestError('El nombre del producto es obligatorio');
    }
    if (!dto.price || dto.price <= 0) {
      throw new BadRequestError('El precio debe ser un número positivo');
    }
    if (!dto.category) {
      throw new BadRequestError('La categoría es obligatoria');
    }

    return this.productRepository.create({
      name: dto.name.trim(),
      category: dto.category,
      origin: dto.origin || 'Colombia',
      notes: Array.isArray(dto.notes) ? dto.notes : [],
      process: dto.process || 'Artesanal',
      intensity: dto.intensity ?? 0,
      price: dto.price,
      priceFmt: dto.priceFmt || `$${dto.price.toLocaleString('es-CO')}`,
      accent: dto.accent || '#6B4A35',
      image: dto.image || '/assets/images/products/bolsa-caturra.png',
      badge: dto.badge || 'Café Especial',
      description: dto.description || ''
    });
  }
}
