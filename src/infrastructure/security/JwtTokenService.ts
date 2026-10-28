import jwt from 'jsonwebtoken';
import { UserRole } from '../../domain/entities/User';

export interface JwtPayload {
  id: string;
  role: UserRole;
}

export class JwtTokenService {
  private readonly secret: string;
  private readonly expiresIn: string;

  constructor() {
    this.secret = process.env.JWT_SECRET || 'valkia_secret_key_change_me';
    this.expiresIn = process.env.JWT_EXPIRES_IN || '24h';
  }

  generateToken(payload: JwtPayload): string {
    // Solo id y role en el payload
    return jwt.sign({ id: payload.id, role: payload.role }, this.secret, {
      expiresIn: this.expiresIn
    } as jwt.SignOptions);
  }

  verifyToken(token: string): JwtPayload {
    const decoded = jwt.verify(token, this.secret) as jwt.JwtPayload;
    return {
      id: decoded.id as string,
      role: decoded.role as UserRole
    };
  }
}
