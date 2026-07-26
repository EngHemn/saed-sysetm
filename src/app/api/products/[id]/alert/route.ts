import { NextRequest, NextResponse } from "next/server";
import { ProductRepository } from "@/data/repositories/ProductRepository";
import { GetProductByIdUseCase } from "@/domain/usecases/GetProductByIdUseCase";
import { ToggleActionAlertUseCase } from "@/domain/usecases/ToggleActionAlertUseCase";

const productRepository = new ProductRepository();
const getProductByIdUseCase = new GetProductByIdUseCase(productRepository);
const toggleActionAlertUseCase = new ToggleActionAlertUseCase(productRepository);

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
    return NextResponse.json({ actionAlert: product.actionAlert, id: product.id });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch action alert";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, context: Context) {
  try {
    const { id } = await context.params;
    let actionAlert: boolean | undefined;
    try {
      const body = await request.json();
      if (typeof body.actionAlert === "boolean") {
        actionAlert = body.actionAlert;
      }
    } catch {
      actionAlert = undefined;
    }

    const updatedProduct = await toggleActionAlertUseCase.execute(id, actionAlert);
    return NextResponse.json(updatedProduct);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to update action alert";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}

export async function PUT(request: NextRequest, context: Context) {
  return PATCH(request, context);
}
