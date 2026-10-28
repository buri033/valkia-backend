import { IInteractionRepository } from '../../../domain/repositories/IInteractionRepository';
import { IProductRepository } from '../../../domain/repositories/IProductRepository';
import { Interaction } from '../../../domain/entities/Interaction';
import { CreateInteractionDTO } from '../../dtos/InteractionDTO';
import { BadRequestError, NotFoundError } from '../../errors/AppError';

export class CreateInteractionUseCase {
  constructor(
    private readonly interactionRepository: IInteractionRepository,
    private readonly productRepository: IProductRepository
  ) {}

  async execute(dto: CreateInteractionDTO): Promise<Interaction> {
    if (!dto.userId) {
      throw new BadRequestError('El usuario es obligatorio (obtenido del token)');
    }
    if (!dto.productId) {
      throw new BadRequestError('El producto es obligatorio');
    }
    if (!dto.preference) {
      throw new BadRequestError('La preferencia de notas es obligatoria');
    }

    const product = await this.productRepository.findById(dto.productId);
    if (!product) {
      throw new NotFoundError('El producto seleccionado no existe en el catálogo');
    }

    return this.interactionRepository.create({
      userId: dto.userId,
      productId: dto.productId,
      preference: dto.preference,
      notes: dto.notes
    });
  }
}
