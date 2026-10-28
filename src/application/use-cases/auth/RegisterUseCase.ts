import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { AuthResponseDTO, RegisterDTO } from '../../dtos/AuthDTO';
import { BadRequestError, ConflictError } from '../../errors/AppError';
import { BcryptPasswordHasher } from '../../../infrastructure/security/BcryptPasswordHasher';
import { JwtTokenService } from '../../../infrastructure/security/JwtTokenService';

export class RegisterUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: BcryptPasswordHasher,
    private readonly tokenService: JwtTokenService
  ) {}

  async execute(dto: RegisterDTO): Promise<AuthResponseDTO> {
    if (!dto.name || dto.name.trim().length < 2) {
      throw new BadRequestError('El nombre debe tener al menos 2 caracteres');
    }
    if (!dto.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dto.email)) {
      throw new BadRequestError('El correo electrónico no tiene un formato válido');
    }
    if (!dto.password || dto.password.length < 6) {
      throw new BadRequestError('La contraseña debe tener al menos 6 caracteres');
    }

    // Verificar si el usuario ya existe -> responder 409
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) {
      throw new ConflictError('Ya existe una cuenta registrada con este correo electrónico');
    }

    // Hash de la contraseña con bcrypt (nunca en texto plano)
    const hashedPassword = await this.passwordHasher.hash(dto.password);

    // Crear usuario con rol 'user' por defecto
    const newUser = await this.userRepository.create({
      name: dto.name.trim(),
      email: dto.email.toLowerCase().trim(),
      password: hashedPassword,
      role: 'user'
    });

    // Generar JWT con id y role
    const token = this.tokenService.generateToken({
      id: newUser.id,
      role: newUser.role
    });

    return {
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    };
  }
}
