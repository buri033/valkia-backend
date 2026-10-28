import { prisma } from '../prisma/prisma.client';
import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { PaginatedResult, PaginationParams, Product } from '../../domain/entities/Product';

export class PrismaProductRepository implements IProductRepository {
  async findAll(params: PaginationParams): Promise<PaginatedResult<Product>> {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.max(1, Number(params.limit) || 6);
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (params.category && params.category !== 'todos') {
      where.category = params.category;
    }

    if (params.search && params.search.trim() !== '') {
      where.OR = [
        { name: { contains: params.search, mode: 'insensitive' } },
        { origin: { contains: params.search, mode: 'insensitive' } },
        { description: { contains: params.search, mode: 'insensitive' } }
      ];
    }

    const [total, items] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      })
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      pagination: {
        page,
        limit,
        total,
        totalPages
      },
      data: items.map(p => ({
        id: p.id,
        name: p.name,
        category: p.category,
        origin: p.origin,
        notes: p.notes,
        process: p.process,
        intensity: p.intensity,
        price: p.price,
        priceFmt: p.priceFmt,
        accent: p.accent,
        image: p.image,
        badge: p.badge,
        description: p.description,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt
      }))
    };
  }

  async findById(id: string): Promise<Product | null> {
    const p = await prisma.product.findUnique({
      where: { id }
    });
    if (!p) return null;
    return {
      id: p.id,
      name: p.name,
      category: p.category,
      origin: p.origin,
      notes: p.notes,
      process: p.process,
      intensity: p.intensity,
      price: p.price,
      priceFmt: p.priceFmt,
      accent: p.accent,
      image: p.image,
      badge: p.badge,
      description: p.description,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt
    };
  }

  async create(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const p = await prisma.product.create({
      data: {
        name: data.name,
        category: data.category,
        origin: data.origin,
        notes: data.notes,
        process: data.process,
        intensity: data.intensity || 0,
        price: data.price,
        priceFmt: data.priceFmt || `$${data.price.toLocaleString('es-CO')}`,
        accent: data.accent || '#6B4A35',
        image: data.image,
        badge: data.badge || 'Café Especial',
        description: data.description
      }
    });
    return p;
  }

  async update(id: string, data: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Product | null> {
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) return null;

    const p = await prisma.product.update({
      where: { id },
      data: {
        ...data,
        priceFmt: data.price ? `$${data.price.toLocaleString('es-CO')}` : undefined
      }
    });
    return p;
  }

  async delete(id: string): Promise<boolean> {
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) return false;
    await prisma.product.delete({ where: { id } });
    return true;
  }
}
