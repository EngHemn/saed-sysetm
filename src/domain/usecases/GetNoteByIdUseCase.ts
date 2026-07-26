import { INoteRepository } from "../repositories/INoteRepository";

export class GetNoteByIdUseCase {
  constructor(private noteRepository: INoteRepository) {}

  async execute(id: string) {
    return this.noteRepository.findById(id);
  }
}
