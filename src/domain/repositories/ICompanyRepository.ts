import { Company } from "../entities/Company";

export interface FindCompaniesOptions {
  search?: string;
  page?: number;
  perPage?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface FindCompaniesResult {
  companies: Company[];
  total: number;
}

export interface ICompanyRepository {
  findAll(options?: FindCompaniesOptions): Promise<FindCompaniesResult>;
  findById(id: string): Promise<Company | null>;
  create(data: {
    name: string;
    phone: string;
    image?: string | null;
    note?: string | null;
    address?: string | null;
  }): Promise<Company>;
  update(
    id: string,
    data: {
      name: string;
      phone: string;
      image?: string | null;
      note?: string | null;
      address?: string | null;
    }
  ): Promise<Company>;
  delete(id: string): Promise<Company>;
}
