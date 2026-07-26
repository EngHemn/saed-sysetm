import { INeedRepository } from "../repositories/INeedRepository";
import { NeedInput } from "../schemas/need";

export class CreateNeedUseCase {
  constructor(private needRepository: INeedRepository) {}

  async execute(data: NeedInput) {
    return this.needRepository.create(data);
  }
}
