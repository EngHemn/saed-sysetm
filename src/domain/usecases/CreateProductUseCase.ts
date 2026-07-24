import { IProductRepository } from "../repositories/IProductRepository";
import { ProductInput } from "../schemas/product";

export class CreateProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(data: ProductInput) {
    return this.productRepository.create(data);
  }
}
