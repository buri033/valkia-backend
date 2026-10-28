import { prisma } from '../prisma/prisma.client';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User, UserWithoutPassword } from '../../domain/entities/User';

export class PrismaUserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });
    if (!user) return null;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role as 'admin' | 'user',
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  async findById(id: string): Promise<UserWithoutPassword | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });
    if (!user) return null;
    return {
      ...user,
      role: user.role as 'admin' | 'user'
    };
  }

  async create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserWithoutPassword> {
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase().trim(),
        password: data.password!,
        role: data.role
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });
    return {
      ...user,
      role: user.role as 'admin' | 'user'
    };
  }
}
