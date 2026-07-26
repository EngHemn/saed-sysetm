import { NextRequest, NextResponse } from "next/server";
import { ProductRepository } from "@/data/repositories/ProductRepository";
import { GetProductsUseCase } from "@/domain/usecases/GetProductsUseCase";
import { CreateProductUseCase } from "@/domain/usecases/CreateProductUseCase";

const productRepository = new ProductRepository();
const getProductsUseCase = new GetProductsUseCase(productRepository);
const createProductUseCase = new CreateProductUseCase(productRepository);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const categoryId = searchParams.get("categoryId") || undefined;
    const brand = searchParams.get("brand") || undefined;
    const actionAlertParam = searchParams.get("actionAlert");
    const actionAlert = actionAlertParam === "true" ? true : actionAlertParam === "false" ? false : undefined;
    const pageStr = searchParams.get("page");
    const perPageStr = searchParams.get("perPage");
    const page = pageStr ? parseInt(pageStr, 10) : undefined;
    const perPage = perPageStr ? parseInt(perPageStr, 10) : undefined;
    const sortBy = searchParams.get("sortBy") || undefined;
    const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || undefined;

    const result = await getProductsUseCase.execute({
      search,
      categoryId,
      brand,
      actionAlert,
      page,
      perPage,
      sortBy,
      sortOrder,
    });
    return NextResponse.json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch products";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const product = await createProductUseCase.execute(body);
    return NextResponse.json(product, { status: 201 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to create product";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
