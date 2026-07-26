import { IBillRepository } from "../repositories/IBillRepository";
import { BillInput } from "../schemas/bill";

export class CreateBillUseCase {
  constructor(private billRepository: IBillRepository) {}

  async execute(data: BillInput) {
    return this.billRepository.create(data);
  }
}
