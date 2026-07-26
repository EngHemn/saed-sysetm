import { Category } from "./Category";

export interface Product {
  id: string;
  title: string;
  description?: string | null;
  image?: string | null;
  initPrice: number;
  middlePrice: number;
  finalPrice: number;
  stock: number;
  brand?: string | null;
  categoryId: string;
  actionAlert: boolean;
  info?: { title: string; description: string }[] | null;
  category?: Category;
  createdAt: Date;
  updatedAt: Date;
}
