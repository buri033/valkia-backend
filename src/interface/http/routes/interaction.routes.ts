import { Router } from 'express';
import { InteractionController } from '../controllers/InteractionController';
import { authMiddleware } from '../middlewares/auth.middleware';
import { soloAdmin } from '../middlewares/role.middleware';

export const interactionRouter = Router();

// Endpoint para crear interacción (requiere sesión activa, a nombre del usuario del token)
interactionRouter.post('/', authMiddleware, InteractionController.create);

// Endpoint para que el usuario autenticado consulte únicamente sus interacciones
interactionRouter.get('/mias', authMiddleware, InteractionController.getMyInteractions);

// Endpoint para que solo el administrador consulte todas las interacciones
interactionRouter.get('/', authMiddleware, soloAdmin, InteractionController.getAll);
