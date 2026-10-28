import { Product } from './Product';
import { UserWithoutPassword } from './User';

export interface Interaction {
  id: string;
  userId: string;
  user?: UserWithoutPassword;
  productId: string;
  product?: Product;
  preference: string;
  notes?: string | null;
  createdAt: Date;
}
