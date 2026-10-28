import { PrismaClient } from '@prisma/client';

// PrismaClient centralizado en infrastructure/ según la arquitectura requerida
export const prisma = new PrismaClient();
