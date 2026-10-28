import { Response, NextFunction } from 'express';
import { CreateInteractionUseCase } from '../../../application/use-cases/interaction/CreateInteractionUseCase';
import { GetUserInteractionsUseCase, GetAllInteractionsUseCase } from '../../../application/use-cases/interaction/GetInteractionsUseCases';
import { PrismaInteractionRepository } from '../../../infrastructure/repositories/PrismaInteractionRepository';
import { PrismaProductRepository } from '../../../infrastructure/repositories/PrismaProductRepository';
import { BadRequestError } from '../../../application/errors/AppError';
import { AuthenticatedRequest } from '../types/auth.types';

const interactionRepository = new PrismaInteractionRepository();
const productRepository = new PrismaProductRepository();

const createInteractionUseCase = new CreateInteractionUseCase(interactionRepository, productRepository);
const getUserInteractionsUseCase = new GetUserInteractionsUseCase(interactionRepository);
const getAllInteractionsUseCase = new GetAllInteractionsUseCase(interactionRepository);

export class InteractionController {
  static async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new BadRequestError('Usuario no autenticado');
      }

      // CRÍTICO: El userId se toma exclusivamente del token autenticado, NUNCA del body
      const userId = req.user.id;
      const { productId, preference, notes } = req.body;

      const interaction = await createInteractionUseCase.execute({
        userId,
        productId,
        preference,
        notes
      });

      res.status(201).json(interaction);
    } catch (error) {
      next(error);
    }
  }

  static async getMyInteractions(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new BadRequestError('Usuario no autenticado');
      }

      const interactions = await getUserInteractionsUseCase.execute(req.user.id);
      res.status(200).json(interactions);
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const interactions = await getAllInteractionsUseCase.execute();
      res.status(200).json(interactions);
    } catch (error) {
      next(error);
    }
  }
}
