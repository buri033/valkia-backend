import { Request, Response, NextFunction } from 'express';
import { RegisterUseCase } from '../../../application/use-cases/auth/RegisterUseCase';
import { LoginUseCase } from '../../../application/use-cases/auth/LoginUseCase';
import { PrismaUserRepository } from '../../../infrastructure/repositories/PrismaUserRepository';
import { BcryptPasswordHasher } from '../../../infrastructure/security/BcryptPasswordHasher';
import { JwtTokenService } from '../../../infrastructure/security/JwtTokenService';
import { AuthenticatedRequest } from '../types/auth.types';

const userRepository = new PrismaUserRepository();
const passwordHasher = new BcryptPasswordHasher();
const tokenService = new JwtTokenService();

const registerUseCase = new RegisterUseCase(userRepository, passwordHasher, tokenService);
const loginUseCase = new LoginUseCase(userRepository, passwordHasher, tokenService);

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, email, password } = req.body;
      const result = await registerUseCase.execute({ name, email, password });
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await loginUseCase.execute({ email, password });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async me(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'No autenticado' });
        return;
      }
      const user = await userRepository.findById(req.user.id);
      if (!user) {
        res.status(404).json({ error: 'Usuario no encontrado' });
        return;
      }
      res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  }
}
