import { IBillRepository } from "../repositories/IBillRepository";

export class GetBillByIdUseCase {
  constructor(private billRepository: IBillRepository) {}

  async execute(id: string) {
    return this.billRepository.findById(id);
  }
}
