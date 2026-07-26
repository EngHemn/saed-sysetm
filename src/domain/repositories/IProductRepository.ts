import { Product } from "../entities/Product";
import { ProductInput } from "../schemas/product";

export interface FindProductsOptions {
  search?: string;
  categoryId?: string;
  brand?: string;
  actionAlert?: boolean;
  page?: number;
  perPage?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface FindProductsResult {
  products: Product[];
  total: number;
}

export interface IProductRepository {
  findAll(options?: FindProductsOptions): Promise<FindProductsResult>;
  findById(id: string): Promise<Product | null>;
  create(data: ProductInput): Promise<Product>;
  update(id: string, data: ProductInput): Promise<Product>;
  delete(id: string): Promise<Product>;
  updateActionAlert(id: string, actionAlert: boolean): Promise<Product>;
}
