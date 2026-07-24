import { NextRequest, NextResponse } from "next/server";
import { CategoryRepository } from "@/data/repositories/CategoryRepository";
import { GetCategoriesUseCase } from "@/domain/usecases/GetCategoriesUseCase";
import { CreateCategoryUseCase } from "@/domain/usecases/CreateCategoryUseCase";

const categoryRepository = new CategoryRepository();
const getCategoriesUseCase = new GetCategoriesUseCase(categoryRepository);
const createCategoryUseCase = new CreateCategoryUseCase(categoryRepository);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const categories = await getCategoriesUseCase.execute(search);
    return NextResponse.json(categories);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const category = await createCategoryUseCase.execute(body);
    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create category" },
      { status: 400 }
    );
  }
}
