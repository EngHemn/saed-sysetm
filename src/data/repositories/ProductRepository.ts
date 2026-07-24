import { prisma } from "@/lib/prisma";
import { Product } from "@/domain/entities/Product";
import { IProductRepository, FindProductsOptions, FindProductsResult } from "@/domain/repositories/IProductRepository";
import { ProductInput } from "@/domain/schemas/product";

export class ProductRepository implements IProductRepository {
  async findAll(options?: FindProductsOptions): Promise<FindProductsResult> {
    const search = options?.search;
    const categoryId = options?.categoryId && options.categoryId !== "all" ? options.categoryId : undefined;
    const brand = options?.brand && options.brand !== "all" ? options.brand : undefined;
    const page = options?.page || 1;
    const perPage = options?.perPage || 10;
    const sortBy = options?.sortBy || "createdAt";
    const sortOrder = options?.sortOrder || "desc";

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { brand: { contains: search, mode: "insensitive" } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (brand) {
      where.brand = brand;
    }

    const orderBy: any = {};
    const validSortFields = ["title", "initPrice", "finalPrice", "createdAt"];
    if (validSortFields.includes(sortBy)) {
      orderBy[sortBy] = sortOrder;
    } else {
      orderBy.createdAt = "desc";
    }

    const skip = (page - 1) * perPage;
    const take = perPage;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
        },
        orderBy,
        skip,
        take,
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products: products as unknown as Product[],
      total,
    };
  }

  async findById(id: string): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    }) as unknown as Product | null;
  }

  async create(data: ProductInput): Promise<Product> {
    return prisma.product.create({
      data: {
        title: data.title,
        description: data.description || null,
        image: data.image || null,
        initPrice: data.initPrice,
        finalPrice: data.finalPrice,
        brand: data.brand || null,
        categoryId: data.categoryId,
        info: data.info || null,
      },
      include: {
        category: true,
      },
    }) as unknown as Product;
  }

  async update(id: string, data: ProductInput): Promise<Product> {
    return prisma.product.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description || null,
        image: data.image || null,
        initPrice: data.initPrice,
        finalPrice: data.finalPrice,
        brand: data.brand || null,
        categoryId: data.categoryId,
        info: data.info || null,
      },
      include: {
        category: true,
      },
    }) as unknown as Product;
  }

  async delete(id: string): Promise<Product> {
    return prisma.product.delete({
      where: { id },
      include: {
        category: true,
      },
    }) as unknown as Product;
  }
}
