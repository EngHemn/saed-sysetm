import { Bill } from "./Bill";

export interface Company {
  id: string;
  name: string;
  phone: string;
  image?: string | null;
  note?: string | null;
  address?: string | null;
  createdAt: Date;
  updatedAt: Date;
  bills?: Bill[];
}
