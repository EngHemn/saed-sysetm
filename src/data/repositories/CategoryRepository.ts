import { prisma } from "@/lib/prisma";
import { Category } from "@/domain/entities/Category";
import { ICategoryRepository } from "@/domain/repositories/ICategoryRepository";
import { CategoryInput } from "@/domain/schemas/category";

export class CategoryRepository implements ICategoryRepository {
  async findAll(search?: string): Promise<Category[]> {
    const where: any = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }
    return prisma.category.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string): Promise<Category | null> {
    return prisma.category.findUnique({
      where: { id },
    });
  }

  async create(data: CategoryInput): Promise<Category> {
    return prisma.category.create({
      data: {
        title: data.title,
        image: data.image || null,
        description: data.description || null,
        brand: data.brand,
      },
    });
  }

  async update(id: string, data: CategoryInput): Promise<Category> {
    return prisma.category.update({
      where: { id },
      data: {
        title: data.title,
        image: data.image || null,
        description: data.description || null,
        brand: data.brand,
      },
    });
  }

  async delete(id: string): Promise<Category> {
    return prisma.category.delete({
      where: { id },
    });
  }
}
