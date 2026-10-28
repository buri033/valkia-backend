import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../../application/errors/AppError';
import { Prisma } from '@prisma/client';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Errores controlados de la aplicación (AppError)
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message
    });
    return;
  }

  // Errores conocidos de Prisma capturados sin stack trace
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      res.status(409).json({
        error: 'Conflicto: ya existe un registro con un valor único duplicado'
      });
      return;
    }
    if (err.code === 'P2025') {
      res.status(404).json({
        error: 'El recurso solicitado no fue encontrado en la base de datos'
      });
      return;
    }
    res.status(400).json({
      error: 'Error en la operación de base de datos'
    });
    return;
  }

  // Error inesperado del servidor: sin stack trace expuesto al cliente
  console.error('[Internal Server Error]', err.message);
  res.status(500).json({
    error: 'Ocurrió un error interno en el servidor. Inténtalo más tarde.'
  });
}
