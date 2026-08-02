import { NextRequest, NextResponse } from "next/server";
import { CompanyRepository } from "@/data/repositories/CompanyRepository";
import { GetCompanyByIdUseCase } from "@/domain/usecases/GetCompanyByIdUseCase";
import { UpdateCompanyUseCase } from "@/domain/usecases/UpdateCompanyUseCase";
import { DeleteCompanyUseCase } from "@/domain/usecases/DeleteCompanyUseCase";
import { deleteCloudinaryImageByUrl } from "@/lib/cloudinary";

const companyRepository = new CompanyRepository();
const getCompanyByIdUseCase = new GetCompanyByIdUseCase(companyRepository);
const updateCompanyUseCase = new UpdateCompanyUseCase(companyRepository);
const deleteCompanyUseCase = new DeleteCompanyUseCase(companyRepository);

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const company = await getCompanyByIdUseCase.execute(id);
    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }
    return NextResponse.json(company);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch company";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existingCompany = await getCompanyByIdUseCase.execute(id);
    const company = await updateCompanyUseCase.execute(id, body);

    if (
      existingCompany &&
      existingCompany.image &&
      body.image !== undefined &&
      existingCompany.image !== body.image
    ) {
      await deleteCloudinaryImageByUrl(existingCompany.image);
    }

    return NextResponse.json(company);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to update company";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const companyToDelete = await getCompanyByIdUseCase.execute(id);
    if (companyToDelete && companyToDelete.image) {
      await deleteCloudinaryImageByUrl(companyToDelete.image);
    }

    const company = await deleteCompanyUseCase.execute(id);
    return NextResponse.json(company);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to delete company";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
