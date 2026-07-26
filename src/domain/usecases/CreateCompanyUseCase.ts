import { ICompanyRepository } from "../repositories/ICompanyRepository";
import { CompanyInput } from "../schemas/company";

export class CreateCompanyUseCase {
  constructor(private companyRepository: ICompanyRepository) {}

  async execute(data: CompanyInput) {
    return this.companyRepository.create(data);
  }
}
