import { Bill } from "../entities/Bill";
import { BillInput } from "../schemas/bill";

export interface FindBillsOptions {
  search?: string;
  paymentStatus?: "Paid" | "Partially Paid" | "Unpaid" | "all";
  page?: number;
  perPage?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface FindBillsResult {
  bills: Bill[];
  total: number;
}

export interface IBillRepository {
  findAll(options?: FindBillsOptions): Promise<FindBillsResult>;
  findById(id: string): Promise<Bill | null>;
  create(data: BillInput): Promise<Bill>;
  update(id: string, data: BillInput): Promise<Bill>;
  updateStatus(id: string, paymentStatus: "Paid" | "Partially Paid" | "Unpaid", paidAmount?: number): Promise<Bill>;
  delete(id: string): Promise<Bill>;
}
