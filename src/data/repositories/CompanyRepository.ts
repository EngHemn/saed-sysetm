import { prisma } from "@/lib/prisma";
import { Company } from "@/domain/entities/Company";
import { ICompanyRepository, FindCompaniesOptions, FindCompaniesResult } from "@/domain/repositories/ICompanyRepository";
import { Prisma } from "@prisma/client";

export class CompanyRepository implements ICompanyRepository {
  async findAll(options?: FindCompaniesOptions): Promise<FindCompaniesResult> {
    const search = options?.search;
    const page = options?.page || 1;
    const perPage = options?.perPage || 10;
    const sortBy = options?.sortBy || "createdAt";
    const sortOrder = options?.sortOrder || "desc";

    const where: Prisma.CompanyWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        { address: { contains: search, mode: "insensitive" } },
      ];
    }

    const orderBy: Prisma.CompanyOrderByWithRelationInput = {};
    const validSortFields = ["name", "phone", "createdAt"];
    if (validSortFields.includes(sortBy)) {
      orderBy[sortBy as keyof Prisma.CompanyOrderByWithRelationInput] = sortOrder;
    } else {
      orderBy.createdAt = "desc";
    }

    const skip = (page - 1) * perPage;
    const take = perPage;

    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        where,
        include: {
          bills: {
            select: {
              totalAmount: true,
              paidAmount: true,
              remainingAmount: true,
            },
          },
        },
        orderBy,
        skip,
        take,
      }),
      prisma.company.count({ where }),
    ]);

    return {
      companies: companies as Company[],
      total,
    };
  }

  async findById(id: string): Promise<Company | null> {
    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        bills: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    return company as any;
  }

  async create(data: {
    name: string;
    phone: string;
    image?: string | null;
    note?: string | null;
    address?: string | null;
  }): Promise<Company> {
    const company = await prisma.company.create({
      data: {
        name: data.name,
        phone: data.phone,
        image: data.image || null,
        note: data.note || null,
        address: data.address || null,
      },
    });
    return company as Company;
  }

  async update(
    id: string,
    data: {
      name: string;
      phone: string;
      image?: string | null;
      note?: string | null;
      address?: string | null;
    }
  ): Promise<Company> {
    const company = await prisma.company.update({
      where: { id },
      data: {
        name: data.name,
        phone: data.phone,
        image: data.image || null,
        note: data.note || null,
        address: data.address || null,
      },
    });
    return company as Company;
  }

  async delete(id: string): Promise<Company> {
    const company = await prisma.company.delete({
      where: { id },
    });
    return company as Company;
  }
}
