import { NextRequest, NextResponse } from "next/server";
import { NoteRepository } from "@/data/repositories/NoteRepository";
import { GetNotesUseCase } from "@/domain/usecases/GetNotesUseCase";
import { CreateNoteUseCase } from "@/domain/usecases/CreateNoteUseCase";

const noteRepository = new NoteRepository();
const getNotesUseCase = new GetNotesUseCase(noteRepository);
const createNoteUseCase = new CreateNoteUseCase(noteRepository);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const notes = await getNotesUseCase.execute(search);
    return NextResponse.json(notes);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const note = await createNoteUseCase.execute(body);
    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to create note";
    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    );
  }
}
