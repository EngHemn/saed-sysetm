import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { Bill } from "@/domain/entities/Bill";
import { IBillRepository, FindBillsOptions, FindBillsResult } from "@/domain/repositories/IBillRepository";
import { BillInput } from "@/domain/schemas/bill";

export class BillRepository implements IBillRepository {
  private calculatePaymentStatus(totalAmount: number, paidAmount: number): "Paid" | "Partially Paid" | "Unpaid" {
    if (paidAmount >= totalAmount && totalAmount > 0) {
      return "Paid";
    }
    if (paidAmount > 0 && paidAmount < totalAmount) {
      return "Partially Paid";
    }
    return "Unpaid";
  }

  private generateBillNumber(): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(1000 + Math.random() * 9000);
    return `INV-${timestamp}-${random}`;
  }

  async findAll(options?: FindBillsOptions): Promise<FindBillsResult> {
    const search = options?.search;
    const paymentStatus = options?.paymentStatus && options.paymentStatus !== "all" ? options.paymentStatus : undefined;
    const page = options?.page || 1;
    const perPage = options?.perPage || 10;
    const sortBy = options?.sortBy || "createdAt";
    const sortOrder = options?.sortOrder || "desc";

    const where: Prisma.BillWhereInput = {};

    if (search) {
      where.OR = [
        { billNumber: { contains: search, mode: "insensitive" } },
        { customerName: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }

    if (paymentStatus) {
      where.paymentStatus = paymentStatus;
    }

    const orderBy: Prisma.BillOrderByWithRelationInput = {};
    const validSortFields = ["billNumber", "customerName", "totalAmount", "paidAmount", "remainingAmount", "createdAt"];
    if (validSortFields.includes(sortBy)) {
      orderBy[sortBy as keyof Prisma.BillOrderByWithRelationInput] = sortOrder;
    } else {
      orderBy.createdAt = "desc";
    }

    const skip = (page - 1) * perPage;
    const take = perPage;

        const [bills, total] = await Promise.all([
      prisma.bill.findMany({
        where,
        include: {
          company: true,
          items: {
            include: {
              product: {
                include: {
                  category: true,
                },
              },
            },
          },
        },
        orderBy,
        skip,
        take,
      }),
      prisma.bill.count({ where }),
    ]);

    return {
      bills: bills as unknown as Bill[],
      total,
    };
  }

  async findById(id: string): Promise<Bill | null> {
    const bill = await prisma.bill.findUnique({
      where: { id },
      include: {
        company: true,
        items: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });
    return bill as unknown as Bill | null;
  }

  async create(data: BillInput): Promise<Bill> {
    const totalAmount = data.items.reduce((acc, item) => {
      const qty = Math.max(1, item.quantity);
      const price = Math.max(0, item.unitPrice);
      return acc + qty * price;
    }, 0);

    const paidAmount = Math.max(0, Math.min(data.paidAmount, totalAmount));
    const remainingAmount = Math.max(0, totalAmount - paidAmount);
    const paymentStatus = this.calculatePaymentStatus(totalAmount, paidAmount);
    const billNumber = this.generateBillNumber();
    const billDate = data.billDate ? new Date(data.billDate) : new Date();

    const createdBill = await prisma.$transaction(async (tx) => {
      const bill = await tx.bill.create({
        data: {
          billNumber,
          customerName: data.customerName,
          phone: data.phone,
          address: data.address || null,
          image: data.image || null,
          billDate,
          totalAmount,
          paidAmount,
          remainingAmount,
          paymentStatus,
          notes: data.notes || null,
          companyId: data.companyId || null,
          items: {
            create: data.items.map((item) => {
              const qty = Math.max(1, item.quantity);
              const price = Math.max(0, item.unitPrice);
              return {
                productId: item.productId || null,
                productName: item.productName,
                quantity: qty,
                unitPrice: price,
                totalPrice: qty * price,
                initialPrice: item.initialPrice,
                middlePrice: item.middlePrice,
                finalPrice: item.finalPrice,
              };
            }),
          },
        },
        include: {
          company: true,
          items: {
            include: {
              product: {
                include: {
                  category: true,
                },
              },
            },
          },
        },
      });

      for (const item of data.items) {
        if (item.productId) {
          const qty = Math.max(1, item.quantity);
          const product = await tx.product.findUnique({
            where: { id: item.productId },
            select: { initPrice: true }
          });
          const updateData: Prisma.ProductUpdateInput = {
            stock: { increment: qty }
          };
          if (product && product.initPrice !== item.initialPrice) {
            updateData.initPrice = item.initialPrice;
          }
          await tx.product.update({
            where: { id: item.productId },
            data: updateData
          });
        }
      }

      return bill;
    });

    return createdBill as unknown as Bill;
  }

  async update(id: string, data: BillInput): Promise<Bill> {
    const totalAmount = data.items.reduce((acc, item) => {
      const qty = Math.max(1, item.quantity);
      const price = Math.max(0, item.unitPrice);
      return acc + qty * price;
    }, 0);

    const paidAmount = Math.max(0, Math.min(data.paidAmount, totalAmount));
    const remainingAmount = Math.max(0, totalAmount - paidAmount);
    const paymentStatus = this.calculatePaymentStatus(totalAmount, paidAmount);
    const billDate = data.billDate ? new Date(data.billDate) : new Date();

    const updatedBill = await prisma.$transaction(async (tx) => {
      const existingBill = await tx.bill.findUnique({
        where: { id },
        include: { items: true },
      });

      if (existingBill) {
        if (existingBill.paymentStatus === "Paid" && paymentStatus === "Unpaid") {
          throw new Error("A paid bill cannot be changed to unpaid");
        }
        for (const item of existingBill.items) {
          if (item.productId) {
            await tx.product.update({
              where: { id: item.productId },
              data: {
                stock: { decrement: item.quantity },
              },
            });
          }
        }
      }

      await tx.billItem.deleteMany({
        where: { billId: id },
      });

      const updated = await tx.bill.update({
        where: { id },
        data: {
          customerName: data.customerName,
          phone: data.phone,
          address: data.address || null,
          image: data.image || null,
          billDate,
          totalAmount,
          paidAmount,
          remainingAmount,
          paymentStatus,
          notes: data.notes || null,
          companyId: data.companyId || null,
          items: {
            create: data.items.map((item) => {
              const qty = Math.max(1, item.quantity);
              const price = Math.max(0, item.unitPrice);
              return {
                productId: item.productId || null,
                productName: item.productName,
                quantity: qty,
                unitPrice: price,
                totalPrice: qty * price,
                initialPrice: item.initialPrice,
                middlePrice: item.middlePrice,
                finalPrice: item.finalPrice,
              };
            }),
          },
        },
        include: {
          company: true,
          items: {
            include: {
              product: {
                include: {
                  category: true,
                },
              },
            },
          },
        },
      });

      for (const item of data.items) {
        if (item.productId) {
          const qty = Math.max(1, item.quantity);
          const product = await tx.product.findUnique({
            where: { id: item.productId },
            select: { initPrice: true }
          });
          const updateData: Prisma.ProductUpdateInput = {
            stock: { increment: qty }
          };
          if (product && product.initPrice !== item.initialPrice) {
            updateData.initPrice = item.initialPrice;
          }
          await tx.product.update({
            where: { id: item.productId },
            data: updateData
          });
        }
      }

      return updated;
    });

    return updatedBill as unknown as Bill;
  }

  async updateStatus(id: string, paymentStatus: "Paid" | "Partially Paid" | "Unpaid", customPaidAmount?: number): Promise<Bill> {
    const existingBill = await prisma.bill.findUnique({ where: { id } });
    if (!existingBill) throw new Error("Bill not found");

    if (existingBill.paymentStatus === "Paid" && paymentStatus === "Unpaid") {
      throw new Error("A paid bill cannot be changed to unpaid");
    }

    const totalAmount = existingBill.totalAmount;
    let paidAmount = existingBill.paidAmount;

    if (paymentStatus === "Paid") {
      paidAmount = totalAmount;
    } else if (paymentStatus === "Unpaid") {
      paidAmount = 0;
    } else if (paymentStatus === "Partially Paid") {
      if (customPaidAmount !== undefined && customPaidAmount >= 0) {
        paidAmount = Math.min(customPaidAmount, totalAmount);
      } else if (paidAmount <= 0 || paidAmount >= totalAmount) {
        paidAmount = totalAmount > 0 ? Number((totalAmount / 2).toFixed(2)) : 0;
      }
    }

    const remainingAmount = Math.max(0, Number((totalAmount - paidAmount).toFixed(2)));

    const updated = await prisma.bill.update({
      where: { id },
      data: {
        paymentStatus,
        paidAmount,
        remainingAmount,
      },
      include: {
        company: true,
        items: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

    return updated as unknown as Bill;
  }

  async delete(id: string): Promise<Bill> {
    const deletedBill = await prisma.$transaction(async (tx) => {
      const existingBill = await tx.bill.findUnique({
        where: { id },
        include: { items: true },
      });

      if (existingBill) {
        for (const item of existingBill.items) {
          if (item.productId) {
            await tx.product.update({
              where: { id: item.productId },
              data: {
                stock: { decrement: item.quantity },
              },
            });
          }
        }
      }

      return tx.bill.delete({
        where: { id },
        include: {
          items: true,
        },
      });
    });

    return deletedBill as unknown as Bill;
  }
}
