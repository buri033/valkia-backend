import { Response, NextFunction } from 'express';
import { JwtTokenService } from '../../../infrastructure/security/JwtTokenService';
import { AuthenticatedRequest } from '../types/auth.types';

const tokenService = new JwtTokenService();

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      error: 'Token no proporcionado o formato inválido'
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = tokenService.verifyToken(token);
    req.user = {
      id: payload.id,
      role: payload.role
    };
    next();
  } catch (error) {
    res.status(401).json({
      error: 'Token inválido o expirado'
    });
    return;
  }
}
