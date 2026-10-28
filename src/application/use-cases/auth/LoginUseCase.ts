import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { AuthResponseDTO, LoginDTO } from '../../dtos/AuthDTO';
import { BadRequestError, UnauthorizedError } from '../../errors/AppError';
import { BcryptPasswordHasher } from '../../../infrastructure/security/BcryptPasswordHasher';
import { JwtTokenService } from '../../../infrastructure/security/JwtTokenService';

export class LoginUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: BcryptPasswordHasher,
    private readonly tokenService: JwtTokenService
  ) {}

  async execute(dto: LoginDTO): Promise<AuthResponseDTO> {
    if (!dto.email || !dto.password) {
      throw new BadRequestError('El correo y la contraseña son obligatorios');
    }

    const user = await this.userRepository.findByEmail(dto.email);
    if (!user || !user.password) {
      // 401 con mensaje genérico que no revela si falló el email o la contraseña
      throw new UnauthorizedError('Credenciales inválidas');
    }

    const isValidPassword = await this.passwordHasher.compare(dto.password, user.password);
    if (!isValidPassword) {
      // 401 genérico
      throw new UnauthorizedError('Credenciales inválidas');
    }

    // Generar JWT con payload mínimo: id y role
    const token = this.tokenService.generateToken({
      id: user.id,
      role: user.role
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  }
}
