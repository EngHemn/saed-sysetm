import { NextRequest, NextResponse } from "next/server";
import { CompanyRepository } from "@/data/repositories/CompanyRepository";
import { GetCompanyByIdUseCase } from "@/domain/usecases/GetCompanyByIdUseCase";
import { UpdateCompanyUseCase } from "@/domain/usecases/UpdateCompanyUseCase";
import { DeleteCompanyUseCase } from "@/domain/usecases/DeleteCompanyUseCase";

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
    const company = await updateCompanyUseCase.execute(id, body);
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
    const company = await deleteCompanyUseCase.execute(id);
    return NextResponse.json(company);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to delete company";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
