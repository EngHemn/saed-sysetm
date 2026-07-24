import { ICategoryRepository } from "../repositories/ICategoryRepository";
import { CategoryInput, categorySchema } from "../schemas/category";

export class CreateCategoryUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(input: CategoryInput) {
    const validated = categorySchema.parse(input);
    return this.categoryRepository.create(validated);
  }
}
