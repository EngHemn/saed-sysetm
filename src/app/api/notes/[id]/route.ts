import { NextResponse } from "next/server";
import { NoteRepository } from "@/data/repositories/NoteRepository";
import { GetNoteByIdUseCase } from "@/domain/usecases/GetNoteByIdUseCase";
import { UpdateNoteUseCase } from "@/domain/usecases/UpdateNoteUseCase";
import { DeleteNoteUseCase } from "@/domain/usecases/DeleteNoteUseCase";

const noteRepository = new NoteRepository();
const getNoteByIdUseCase = new GetNoteByIdUseCase(noteRepository);
const updateNoteUseCase = new UpdateNoteUseCase(noteRepository);
const deleteNoteUseCase = new DeleteNoteUseCase(noteRepository);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const note = await getNoteByIdUseCase.execute(id);
    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }
    return NextResponse.json(note);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch note" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const note = await updateNoteUseCase.execute(id, body);
    return NextResponse.json(note);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to update note";
    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const note = await deleteNoteUseCase.execute(id);
    return NextResponse.json(note);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to delete note";
    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    );
  }
}
