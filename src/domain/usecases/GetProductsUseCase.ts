import { IProductRepository, FindProductsOptions } from "../repositories/IProductRepository";

export class GetProductsUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(options?: FindProductsOptions) {
    return this.productRepository.findAll(options);
  }
}
