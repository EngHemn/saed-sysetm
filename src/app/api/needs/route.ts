import { NextRequest, NextResponse } from "next/server";
import { NeedRepository } from "@/data/repositories/NeedRepository";
import { GetNeedsUseCase } from "@/domain/usecases/GetNeedsUseCase";
import { CreateNeedUseCase } from "@/domain/usecases/CreateNeedUseCase";

const needRepository = new NeedRepository();
const getNeedsUseCase = new GetNeedsUseCase(needRepository);
const createNeedUseCase = new CreateNeedUseCase(needRepository);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const priority = searchParams.get("priority") || undefined;
    const pageStr = searchParams.get("page");
    const perPageStr = searchParams.get("perPage");
    const page = pageStr ? parseInt(pageStr, 10) : undefined;
    const perPage = perPageStr ? parseInt(perPageStr, 10) : undefined;

    const result = await getNeedsUseCase.execute({
      search,
      priority,
      page,
      perPage,
    });
    return NextResponse.json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch needs";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const need = await createNeedUseCase.execute(body);
    return NextResponse.json(need, { status: 201 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to create need";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
