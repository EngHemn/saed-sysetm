import { IProductRepository } from "../repositories/IProductRepository";
import { Product } from "../entities/Product";

export class ToggleActionAlertUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(id: string, actionAlert?: boolean): Promise<Product> {
    const existing = await this.productRepository.findById(id);
    if (!existing) {
      throw new Error("Product not found");
    }
    const nextState = actionAlert !== undefined ? actionAlert : !existing.actionAlert;
    return this.productRepository.updateActionAlert(id, nextState);
  }
}
