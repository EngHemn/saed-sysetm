import { ICategoryRepository } from "../repositories/ICategoryRepository";
import { CategoryInput, categorySchema } from "../schemas/category";

export class UpdateCategoryUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(id: string, input: CategoryInput) {
    const validated = categorySchema.parse(input);
    return this.categoryRepository.update(id, validated);
  }
}
