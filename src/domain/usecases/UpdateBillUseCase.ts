import { IBillRepository } from "../repositories/IBillRepository";
import { BillInput } from "../schemas/bill";

export class UpdateBillUseCase {
  constructor(private billRepository: IBillRepository) {}

  async execute(id: string, data: BillInput) {
    return this.billRepository.update(id, data);
  }
}
