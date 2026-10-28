import { IInteractionRepository } from '../../../domain/repositories/IInteractionRepository';
import { Interaction } from '../../../domain/entities/Interaction';

export class GetUserInteractionsUseCase {
  constructor(private readonly interactionRepository: IInteractionRepository) {}

  async execute(userId: string): Promise<Interaction[]> {
    return this.interactionRepository.findByUserId(userId);
  }
}

export class GetAllInteractionsUseCase {
  constructor(private readonly interactionRepository: IInteractionRepository) {}

  async execute(): Promise<Interaction[]> {
    return this.interactionRepository.findAll();
  }
}
