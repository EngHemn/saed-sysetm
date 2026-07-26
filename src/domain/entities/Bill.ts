import { Product } from "./Product";
import { Company } from "./Company";

export interface BillItem {
  id: string;
  billId: string;
  productId?: string | null;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  initialPrice: number;
  middlePrice: number;
  finalPrice: number;
  createdAt: Date;
  updatedAt: Date;
  product?: Product | null;
}

export interface Bill {
  id: string;
  billNumber: string;
  customerName: string;
  phone: string;
  address?: string | null;
  image?: string | null;
  billDate: Date;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  paymentStatus: "Paid" | "Partially Paid" | "Unpaid";
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
  items: BillItem[];
  companyId?: string | null;
  company?: Company | null;
}
