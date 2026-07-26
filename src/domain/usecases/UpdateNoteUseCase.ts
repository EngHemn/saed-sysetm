import { INoteRepository } from "../repositories/INoteRepository";
import { NoteInput, noteSchema } from "../schemas/note";

export class UpdateNoteUseCase {
  constructor(private noteRepository: INoteRepository) {}

  async execute(id: string, input: NoteInput) {
    const validated = noteSchema.parse(input);
    return this.noteRepository.update(id, validated);
  }
}
