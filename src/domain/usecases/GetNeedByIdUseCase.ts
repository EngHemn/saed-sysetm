import { INeedRepository } from "../repositories/INeedRepository";

export class GetNeedByIdUseCase {
  constructor(private needRepository: INeedRepository) {}

  async execute(id: string) {
    return this.needRepository.findById(id);
  }
}
