import { ICompanyRepository } from "../repositories/ICompanyRepository";
import { CompanyInput } from "../schemas/company";

export class UpdateCompanyUseCase {
  constructor(private companyRepository: ICompanyRepository) {}

  async execute(id: string, data: CompanyInput) {
    return this.companyRepository.update(id, data);
  }
}
