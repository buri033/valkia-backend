import { Request, Response, NextFunction } from 'express';
import { GetProductsUseCase } from '../../../application/use-cases/product/GetProductsUseCase';
import { GetProductByIdUseCase } from '../../../application/use-cases/product/GetProductByIdUseCase';
import { CreateProductUseCase } from '../../../application/use-cases/product/CreateProductUseCase';
import { UpdateProductUseCase } from '../../../application/use-cases/product/UpdateProductUseCase';
import { DeleteProductUseCase } from '../../../application/use-cases/product/DeleteProductUseCase';
import { PrismaProductRepository } from '../../../infrastructure/repositories/PrismaProductRepository';

const productRepository = new PrismaProductRepository();
const getProductsUseCase = new GetProductsUseCase(productRepository);
const getProductByIdUseCase = new GetProductByIdUseCase(productRepository);
const createProductUseCase = new CreateProductUseCase(productRepository);
const updateProductUseCase = new UpdateProductUseCase(productRepository);
const deleteProductUseCase = new DeleteProductUseCase(productRepository);

export class ProductController {
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 6;
      const category = req.query.category as string | undefined;
      const search = req.query.search as string | undefined;

      const result = await getProductsUseCase.execute({ page, limit, category, search });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const product = await getProductByIdUseCase.execute(id);
      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await createProductUseCase.execute(req.body);
      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updated = await updateProductUseCase.execute(id, req.body);
      res.status(200).json(updated);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await deleteProductUseCase.execute(id);
      res.status(200).json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
      next(error);
    }
  }
}
