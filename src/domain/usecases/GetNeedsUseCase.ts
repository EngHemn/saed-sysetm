import { INeedRepository, FindNeedsOptions } from "../repositories/INeedRepository";

export class GetNeedsUseCase {
  constructor(private needRepository: INeedRepository) {}

  async execute(options?: FindNeedsOptions) {
    return this.needRepository.findAll(options);
  }
}
