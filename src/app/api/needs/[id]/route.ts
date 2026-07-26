import { NextResponse } from "next/server";
import { NeedRepository } from "@/data/repositories/NeedRepository";
import { GetNeedByIdUseCase } from "@/domain/usecases/GetNeedByIdUseCase";
import { UpdateNeedUseCase } from "@/domain/usecases/UpdateNeedUseCase";
import { DeleteNeedUseCase } from "@/domain/usecases/DeleteNeedUseCase";

const needRepository = new NeedRepository();
const getNeedByIdUseCase = new GetNeedByIdUseCase(needRepository);
const updateNeedUseCase = new UpdateNeedUseCase(needRepository);
const deleteNeedUseCase = new DeleteNeedUseCase(needRepository);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const need = await getNeedByIdUseCase.execute(id);
    if (!need) {
      return NextResponse.json({ error: "Need not found" }, { status: 404 });
    }
    return NextResponse.json(need);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch need";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const need = await updateNeedUseCase.execute(id, body);
    return NextResponse.json(need);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to update need";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const need = await deleteNeedUseCase.execute(id);
    return NextResponse.json(need);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to delete need";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
