import { NextResponse } from "next/server";
import { CategoryRepository } from "@/data/repositories/CategoryRepository";
import { GetCategoryByIdUseCase } from "@/domain/usecases/GetCategoryByIdUseCase";
import { UpdateCategoryUseCase } from "@/domain/usecases/UpdateCategoryUseCase";
import { DeleteCategoryUseCase } from "@/domain/usecases/DeleteCategoryUseCase";
import { deleteCloudinaryImageByUrl } from "@/lib/cloudinary";

const categoryRepository = new CategoryRepository();
const getCategoryByIdUseCase = new GetCategoryByIdUseCase(categoryRepository);
const updateCategoryUseCase = new UpdateCategoryUseCase(categoryRepository);
const deleteCategoryUseCase = new DeleteCategoryUseCase(categoryRepository);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const category = await getCategoryByIdUseCase.execute(id);
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
    return NextResponse.json(category);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch category" },
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

    const existingCategory = await getCategoryByIdUseCase.execute(id);

    const category = await updateCategoryUseCase.execute(id, body);

    // If image changed or removed during update, delete old image from Cloudinary
    if (
      existingCategory &&
      existingCategory.image &&
      body.image !== undefined &&
      existingCategory.image !== body.image
    ) {
      await deleteCloudinaryImageByUrl(existingCategory.image);
    }

    return NextResponse.json(category);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update category" },
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

    // Fetch category to retrieve image URL before deleting
    const categoryToDelete = await getCategoryByIdUseCase.execute(id);
    if (categoryToDelete && categoryToDelete.image) {
      await deleteCloudinaryImageByUrl(categoryToDelete.image);
    }

    const category = await deleteCategoryUseCase.execute(id);
    return NextResponse.json(category);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete category" },
      { status: 400 }
    );
  }
}
