import { ICategoryRepository } from "../repositories/ICategoryRepository";

export class GetCategoryByIdUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(id: string) {
    return this.categoryRepository.findById(id);
  }
}
