import { IBillRepository } from "../repositories/IBillRepository";

export class DeleteBillUseCase {
  constructor(private billRepository: IBillRepository) {}

  async execute(id: string) {
    return this.billRepository.delete(id);
  }
}
