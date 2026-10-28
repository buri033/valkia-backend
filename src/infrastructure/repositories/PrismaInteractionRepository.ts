import { prisma } from '../prisma/prisma.client';
import { IInteractionRepository } from '../../domain/repositories/IInteractionRepository';
import { Interaction } from '../../domain/entities/Interaction';

export class PrismaInteractionRepository implements IInteractionRepository {
  async create(data: {
    userId: string;
    productId: string;
    preference: string;
    notes?: string | null;
  }): Promise<Interaction> {
    const created = await prisma.interaction.create({
      data: {
        userId: data.userId,
        productId: data.productId,
        preference: data.preference,
        notes: data.notes
      },
      include: {
        product: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true
          }
        }
      }
    });

    return {
      id: created.id,
      userId: created.userId,
      user: created.user ? { ...created.user, role: created.user.role as 'admin' | 'user' } : undefined,
      productId: created.productId,
      product: created.product ? {
        ...created.product,
        createdAt: created.product.createdAt,
        updatedAt: created.product.updatedAt
      } : undefined,
      preference: created.preference,
      notes: created.notes,
      createdAt: created.createdAt
    };
  }

  async findByUserId(userId: string): Promise<Interaction[]> {
    const items = await prisma.interaction.findMany({
      where: { userId },
      include: {
        product: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return items.map(item => ({
      id: item.id,
      userId: item.userId,
      productId: item.productId,
      product: item.product ? {
        ...item.product,
        createdAt: item.product.createdAt,
        updatedAt: item.product.updatedAt
      } : undefined,
      preference: item.preference,
      notes: item.notes,
      createdAt: item.createdAt
    }));
  }

  async findAll(): Promise<Interaction[]> {
    const items = await prisma.interaction.findMany({
      include: {
        product: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return items.map(item => ({
      id: item.id,
      userId: item.userId,
      user: item.user ? { ...item.user, role: item.user.role as 'admin' | 'user' } : undefined,
      productId: item.productId,
      product: item.product ? {
        ...item.product,
        createdAt: item.product.createdAt,
        updatedAt: item.product.updatedAt
      } : undefined,
      preference: item.preference,
      notes: item.notes,
      createdAt: item.createdAt
    }));
  }
}
