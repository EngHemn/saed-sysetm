import { INoteRepository } from "../repositories/INoteRepository";
import { NoteInput, noteSchema } from "../schemas/note";

export class CreateNoteUseCase {
  constructor(private noteRepository: INoteRepository) {}

  async execute(input: NoteInput) {
    const validated = noteSchema.parse(input);
    return this.noteRepository.create(validated);
  }
}
