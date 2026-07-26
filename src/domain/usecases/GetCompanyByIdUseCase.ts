import { ICompanyRepository } from "../repositories/ICompanyRepository";

export class GetCompanyByIdUseCase {
  constructor(private companyRepository: ICompanyRepository) {}

  async execute(id: string) {
    return this.companyRepository.findById(id);
  }
}
