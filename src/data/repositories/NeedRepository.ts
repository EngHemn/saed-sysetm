import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { Need } from "@/domain/entities/Need";
import { INeedRepository, FindNeedsOptions, FindNeedsResult } from "@/domain/repositories/INeedRepository";
import { NeedInput } from "@/domain/schemas/need";

export class NeedRepository implements INeedRepository {
  async findAll(options?: FindNeedsOptions): Promise<FindNeedsResult> {
    const search = options?.search;
    const priority = options?.priority;
    const page = options?.page || 1;
    const perPage = options?.perPage || 10;

    const where: Prisma.NeedWhereInput = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (priority && priority !== "all") {
      where.priority = priority;
    }

    const skip = (page - 1) * perPage;
    const take = perPage;

    const [needs, total] = await Promise.all([
      prisma.need.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.need.count({ where }),
    ]);

    return {
      needs: needs as unknown as Need[],
      total,
    };
  }

  async findById(id: string): Promise<Need | null> {
    const need = await prisma.need.findUnique({
      where: { id },
    });
    return need as unknown as Need | null;
  }

  async create(data: NeedInput): Promise<Need> {
    const need = await prisma.need.create({
      data: {
        title: data.title,
        description: data.description || null,
        image: data.image || null,
        priority: data.priority,
        productId: data.productId || null,
      },
    });
    return need as unknown as Need;
  }

  async update(id: string, data: NeedInput): Promise<Need> {
    const need = await prisma.need.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description || null,
        image: data.image || null,
        priority: data.priority,
        productId: data.productId || null,
      },
    });
    return need as unknown as Need;
  }

  async delete(id: string): Promise<Need> {
    const need = await prisma.need.delete({
      where: { id },
    });
    return need as unknown as Need;
  }
}
