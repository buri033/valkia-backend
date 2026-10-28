import { PaginatedResult, PaginationParams, Product } from '../entities/Product';

export interface IProductRepository {
  findAll(params: PaginationParams): Promise<PaginatedResult<Product>>;
  findById(id: string): Promise<Product | null>;
  create(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product>;
  update(id: string, data: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Product | null>;
  delete(id: string): Promise<boolean>;
}
