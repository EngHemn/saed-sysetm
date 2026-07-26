import { ICompanyRepository } from "../repositories/ICompanyRepository";

export class DeleteCompanyUseCase {
  constructor(private companyRepository: ICompanyRepository) {}

  async execute(id: string) {
    return this.companyRepository.delete(id);
  }
}
