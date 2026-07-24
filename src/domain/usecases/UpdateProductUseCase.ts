import { IProductRepository } from "../repositories/IProductRepository";
import { ProductInput } from "../schemas/product";

export class UpdateProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(id: string, data: ProductInput) {
    return this.productRepository.update(id, data);
  }
}
