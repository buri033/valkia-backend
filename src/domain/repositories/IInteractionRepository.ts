import { Interaction } from '../entities/Interaction';

export interface IInteractionRepository {
  create(data: {
    userId: string;
    productId: string;
    preference: string;
    notes?: string | null;
  }): Promise<Interaction>;
  findByUserId(userId: string): Promise<Interaction[]>;
  findAll(): Promise<Interaction[]>;
}
