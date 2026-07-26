import { INoteRepository } from "../repositories/INoteRepository";

export class DeleteNoteUseCase {
  constructor(private noteRepository: INoteRepository) {}

  async execute(id: string) {
    return this.noteRepository.delete(id);
  }
}
