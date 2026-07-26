import { Note } from "../entities/Note";
import { NoteInput } from "../schemas/note";

export interface INoteRepository {
  findAll(search?: string): Promise<Note[]>;
  findById(id: string): Promise<Note | null>;
  create(data: NoteInput): Promise<Note>;
  update(id: string, data: NoteInput): Promise<Note>;
  delete(id: string): Promise<Note>;
}
