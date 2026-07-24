export interface Category {
  id: string;
  title: string;
  image?: string | null;
  description?: string | null;
  brand: string[];
  createdAt: Date;
  updatedAt: Date;
}
