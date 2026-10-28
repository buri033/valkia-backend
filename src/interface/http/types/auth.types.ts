import { Request } from 'express';
import { UserRole } from '../../../domain/entities/User';

export interface AuthenticatedUser {
  id: string;
  role: UserRole;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}
