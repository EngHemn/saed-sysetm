import { NextRequest, NextResponse } from "next/server";
import { BillRepository } from "@/data/repositories/BillRepository";
import { GetBillByIdUseCase } from "@/domain/usecases/GetBillByIdUseCase";
import { UpdateBillUseCase } from "@/domain/usecases/UpdateBillUseCase";
import { UpdateBillStatusUseCase } from "@/domain/usecases/UpdateBillStatusUseCase";
import { DeleteBillUseCase } from "@/domain/usecases/DeleteBillUseCase";

const billRepository = new BillRepository();
const getBillByIdUseCase = new GetBillByIdUseCase(billRepository);
const updateBillUseCase = new UpdateBillUseCase(billRepository);
const updateBillStatusUseCase = new UpdateBillStatusUseCase(billRepository);
const deleteBillUseCase = new DeleteBillUseCase(billRepository);

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const bill = await getBillByIdUseCase.execute(id);
    if (!bill) {
      return NextResponse.json({ error: "Bill not found" }, { status: 404 });
    }
    return NextResponse.json(bill);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch bill";
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
    const bill = await updateBillUseCase.execute(id, body);
    return NextResponse.json(bill);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to update bill";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { paymentStatus, paidAmount } = body;
    if (!paymentStatus || !["Paid", "Partially Paid", "Unpaid"].includes(paymentStatus)) {
      return NextResponse.json({ error: "Invalid payment status" }, { status: 400 });
    }
    const parsedPaidAmount = typeof paidAmount === "number" && !isNaN(paidAmount) ? paidAmount : undefined;
    const bill = await updateBillStatusUseCase.execute(id, paymentStatus, parsedPaidAmount);
    return NextResponse.json(bill);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to update bill status";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const bill = await deleteBillUseCase.execute(id);
    return NextResponse.json(bill);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to delete bill";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
