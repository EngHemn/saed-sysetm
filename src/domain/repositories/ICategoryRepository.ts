import { Category } from "../entities/Category";
import { CategoryInput } from "../schemas/category";

export interface ICategoryRepository {
  findAll(search?: string): Promise<Category[]>;
  findById(id: string): Promise<Category | null>;
  create(data: CategoryInput): Promise<Category>;
  update(id: string, data: CategoryInput): Promise<Category>;
  delete(id: string): Promise<Category>;
}
