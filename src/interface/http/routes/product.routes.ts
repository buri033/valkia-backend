import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';
import { authMiddleware } from '../middlewares/auth.middleware';
import { soloAdmin } from '../middlewares/role.middleware';

export const productRouter = Router();

// Endpoints públicos del catálogo
productRouter.get('/', ProductController.getAll);
productRouter.get('/:id', ProductController.getById);

// Endpoints protegidos para administrador
productRouter.post('/', authMiddleware, soloAdmin, ProductController.create);
productRouter.put('/:id', authMiddleware, soloAdmin, ProductController.update);
productRouter.delete('/:id', authMiddleware, soloAdmin, ProductController.delete);
