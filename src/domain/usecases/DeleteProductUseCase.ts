import { IProductRepository } from "../repositories/IProductRepository";

export class DeleteProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(id: string) {
    return this.productRepository.delete(id);
  }
}
