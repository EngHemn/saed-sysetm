export interface Need {
  id: string;
  title: string;
  description?: string | null;
  image?: string | null;
  priority: string;
  productId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
