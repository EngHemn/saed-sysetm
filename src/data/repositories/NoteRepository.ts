import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { Note } from "@/domain/entities/Note";
import { INoteRepository } from "@/domain/repositories/INoteRepository";
import { NoteInput } from "@/domain/schemas/note";

export class NoteRepository implements INoteRepository {
  async findAll(search?: string): Promise<Note[]> {
    const where: Prisma.NoteWhereInput = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }
    return prisma.note.findMany({
      where,
      orderBy: { updatedAt: "desc" },
    });
  }

  async findById(id: string): Promise<Note | null> {
    return prisma.note.findUnique({
      where: { id },
    });
  }

  async create(data: NoteInput): Promise<Note> {
    return prisma.note.create({
      data: {
        title: data.title,
        description: data.description,
      },
    });
  }

  async update(id: string, data: NoteInput): Promise<Note> {
    return prisma.note.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
      },
    });
  }

  async delete(id: string): Promise<Note> {
    return prisma.note.delete({
      where: { id },
    });
  }
}
