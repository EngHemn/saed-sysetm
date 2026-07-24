import { ICategoryRepository } from "../repositories/ICategoryRepository";

export class GetCategoriesUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(search?: string) {
    return this.categoryRepository.findAll(search);
  }
}
