export interface CreateInteractionDTO {
  userId: string;
  productId: string;
  preference: string;
  notes?: string | null;
}
