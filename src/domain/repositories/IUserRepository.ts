import { User, UserWithoutPassword } from '../entities/User';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<UserWithoutPassword | null>;
  create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserWithoutPassword>;
}
