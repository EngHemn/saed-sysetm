import { INeedRepository } from "../repositories/INeedRepository";
import { NeedInput } from "../schemas/need";

export class UpdateNeedUseCase {
  constructor(private needRepository: INeedRepository) {}

  async execute(id: string, data: NeedInput) {
    return this.needRepository.update(id, data);
  }
}
