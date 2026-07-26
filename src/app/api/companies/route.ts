import { NextRequest, NextResponse } from "next/server";
import { CompanyRepository } from "@/data/repositories/CompanyRepository";
import { GetCompaniesUseCase } from "@/domain/usecases/GetCompaniesUseCase";
import { CreateCompanyUseCase } from "@/domain/usecases/CreateCompanyUseCase";

const companyRepository = new CompanyRepository();
const getCompaniesUseCase = new GetCompaniesUseCase(companyRepository);
const createCompanyUseCase = new CreateCompanyUseCase(companyRepository);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const pageStr = searchParams.get("page");
    const perPageStr = searchParams.get("perPage");
    const page = pageStr ? parseInt(pageStr, 10) : undefined;
    const perPage = perPageStr ? parseInt(perPageStr, 10) : undefined;
    const sortBy = searchParams.get("sortBy") || undefined;
    const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || undefined;

    const result = await getCompaniesUseCase.execute({
      search,
      page,
      perPage,
      sortBy,
      sortOrder,
    });
    return NextResponse.json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch companies";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const company = await createCompanyUseCase.execute(body);
    return NextResponse.json(company, { status: 201 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to create company";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
