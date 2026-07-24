import { ICategoryRepository } from "../repositories/ICategoryRepository";

export class DeleteCategoryUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(id: string) {
    return this.categoryRepository.delete(id);
  }
}
