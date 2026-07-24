import { z } from "zod";

export const productSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().nullable().optional(),
  image: z.string().url("Invalid image URL").nullable().optional().or(z.literal("")),
  initPrice: z.coerce.number().min(0, "Initial price must be at least 0"),
  finalPrice: z.coerce.number().min(0, "Final price must be at least 0"),
  brand: z.string().nullable().optional(),
  categoryId: z.string().min(1, "Category is required"),
  info: z.array(
    z.object({
      title: z.string().min(1, "Title is required"),
      description: z.string().min(1, "Description is required"),
    })
  ).optional().default([]),
});

export type ProductInput = z.infer<typeof productSchema>;
