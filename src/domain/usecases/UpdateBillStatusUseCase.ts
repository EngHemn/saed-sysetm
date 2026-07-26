import { IBillRepository } from "../repositories/IBillRepository";

export class UpdateBillStatusUseCase {
  constructor(private billRepository: IBillRepository) {}

  async execute(id: string, paymentStatus: "Paid" | "Partially Paid" | "Unpaid", paidAmount?: number) {
    return this.billRepository.updateStatus(id, paymentStatus, paidAmount);
  }
}
