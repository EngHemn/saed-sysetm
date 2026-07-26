import { INoteRepository } from "../repositories/INoteRepository";

export class GetNotesUseCase {
  constructor(private noteRepository: INoteRepository) {}

  async execute(search?: string) {
    return this.noteRepository.findAll(search);
  }
}
