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
    const page = searchParams.get("page") ? parseInt(searchParams.get("page")!) : undefined;
    const perPage = searchParams.get("perPage") ? parseInt(searchParams.get("perPage")!) : undefined;
    const sortBy = searchParams.get("sortBy") || undefined;
    const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || undefined;

    const result = await getProductsUseCase.execute({
      search,
      categoryId,
      brand,
      page,
      perPage,
      sortBy,
      sortOrder,
    });
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const product = await createProductUseCase.execute(body);
    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create product" },
      { status: 400 }
    );
  }
}
