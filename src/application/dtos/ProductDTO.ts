export interface CreateProductDTO {
  name: string;
  category: string;
  origin: string;
  notes: string[];
  process: string;
  intensity?: number;
  price: number;
  priceFmt?: string;
  accent?: string;
  image: string;
  badge?: string;
  description: string;
}

export interface UpdateProductDTO extends Partial<CreateProductDTO> {}
