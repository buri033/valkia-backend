import { Router } from 'express';
import { authRouter } from './auth.routes';
import { productRouter } from './product.routes';
import { interactionRouter } from './interaction.routes';

export const apiRouter = Router();

// Mapeo de rutas principales
apiRouter.use('/auth', authRouter);

// Catálogo (soportando tanto /catalogo como /products)
apiRouter.use('/catalogo', productRouter);
apiRouter.use('/products', productRouter);

// Interacción (soportando tanto /interaccion como /interacciones)
apiRouter.use('/interaccion', interactionRouter);
apiRouter.use('/interacciones', interactionRouter);
