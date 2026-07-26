import { NextRequest, NextResponse } from "next/server";
import { BillRepository } from "@/data/repositories/BillRepository";
import { GetBillsUseCase } from "@/domain/usecases/GetBillsUseCase";
import { CreateBillUseCase } from "@/domain/usecases/CreateBillUseCase";

const billRepository = new BillRepository();
const getBillsUseCase = new GetBillsUseCase(billRepository);
const createBillUseCase = new CreateBillUseCase(billRepository);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const paymentStatusParam = searchParams.get("paymentStatus");
    const paymentStatus = (paymentStatusParam as "Paid" | "Partially Paid" | "Unpaid" | "all") || undefined;
    const pageStr = searchParams.get("page");
    const perPageStr = searchParams.get("perPage");
    const page = pageStr ? parseInt(pageStr, 10) : undefined;
    const perPage = perPageStr ? parseInt(perPageStr, 10) : undefined;
    const sortBy = searchParams.get("sortBy") || undefined;
    const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || undefined;

    const result = await getBillsUseCase.execute({
      search,
      paymentStatus,
      page,
      perPage,
      sortBy,
      sortOrder,
    });
    return NextResponse.json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch bills";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const bill = await createBillUseCase.execute(body);
    return NextResponse.json(bill, { status: 201 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to create bill";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
