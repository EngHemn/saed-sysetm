import { ICompanyRepository, FindCompaniesOptions } from "../repositories/ICompanyRepository";

export class GetCompaniesUseCase {
  constructor(private companyRepository: ICompanyRepository) {}

  async execute(options?: FindCompaniesOptions) {
    return this.companyRepository.findAll(options);
  }
}
