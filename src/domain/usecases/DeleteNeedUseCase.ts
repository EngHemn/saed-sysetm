import { INeedRepository } from "../repositories/INeedRepository";

export class DeleteNeedUseCase {
  constructor(private needRepository: INeedRepository) {}

  async execute(id: string) {
    return this.needRepository.delete(id);
  }
}
