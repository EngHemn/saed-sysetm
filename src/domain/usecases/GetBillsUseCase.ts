import { IBillRepository, FindBillsOptions } from "../repositories/IBillRepository";

export class GetBillsUseCase {
  constructor(private billRepository: IBillRepository) {}

  async execute(options?: FindBillsOptions) {
    return this.billRepository.findAll(options);
  }
}
