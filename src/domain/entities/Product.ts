import { Category } from "./Category";

export interface Product {
  id: string;
  title: string;
  description?: string | null;
  image?: string | null;
  initPrice: number;
  finalPrice: number;
  stock: number;
  brand?: string | null;
  categoryId: string;
  info?: { title: string; description: string }[] | null;
  category?: Category;
  createdAt: Date;
  updatedAt: Date;
}
