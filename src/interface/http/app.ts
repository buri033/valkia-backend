import express from 'express';
import cors from 'cors';
import { apiRouter } from './routes';
import { errorHandler } from './middlewares/error.middleware';

export const app = express();

// Configuración de CORS estricto (URL del frontend en Vercel y localhost de desarrollo, nunca '*')
const allowedOrigins = [
  process.env.FRONTEND_URL || 'https://valkia-coffee.vercel.app',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir peticiones sin origen (como Postman o curl) o si coincide con la lista
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Bloqueado por política CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json());

// Endpoint de verificación de estado
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'Valkia Coffee API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Enrutar todas las peticiones bajo /api
app.use('/api', apiRouter);

// Manejo global de errores centralizado
app.use(errorHandler);
