import { NextRequest, NextResponse } from "next/server";
import { ProductRepository } from "@/data/repositories/ProductRepository";
import { GetProductByIdUseCase } from "@/domain/usecases/GetProductByIdUseCase";
import { UpdateProductUseCase } from "@/domain/usecases/UpdateProductUseCase";
import { DeleteProductUseCase } from "@/domain/usecases/DeleteProductUseCase";

const productRepository = new ProductRepository();
const getProductByIdUseCase = new GetProductByIdUseCase(productRepository);
const updateProductUseCase = new UpdateProductUseCase(productRepository);
const deleteProductUseCase = new DeleteProductUseCase(productRepository);

interface Context {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: Context) {
  try {
    const { id } = await context.params;
    const product = await getProductByIdUseCase.execute(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch product";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function PUT(request: Request, context: Context) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const product = await updateProductUseCase.execute(id, body);
    return NextResponse.json(product);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to update product";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}

export async function DELETE(request: Request, context: Context) {
  try {
    const { id } = await context.params;
    const product = await deleteProductUseCase.execute(id);
    return NextResponse.json(product);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to delete product";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
