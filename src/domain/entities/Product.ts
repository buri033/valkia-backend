export interface Product {
  id: string;
  name: string;
  category: string;
  origin: string;
  notes: string[];
  process: string;
  intensity: number;
  price: number;
  priceFmt: string;
  accent: string;
  image: string;
  badge: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginationParams {
  page: number;
  limit: number;
  category?: string;
  search?: string;
}

export interface PaginatedResult<T> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: T[];
}
