import { IProductRepository } from "../repositories/IProductRepository";

export class GetProductByIdUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(id: string) {
    return this.productRepository.findById(id);
  }
}
