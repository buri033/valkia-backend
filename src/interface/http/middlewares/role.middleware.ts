import { Response, NextFunction } from 'express';
import { UserRole } from '../../../domain/entities/User';
import { AuthenticatedRequest } from '../types/auth.types';

export function roleMiddleware(allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'Usuario no autenticado'
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        error: 'Acceso denegado: permisos insuficientes para esta operación'
      });
      return;
    }

    next();
  };
}

export const soloAdmin = roleMiddleware(['admin']);
