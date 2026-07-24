import { z } from "zod";

export const categorySchema = z.object({
  title: z.string().min(1, "Title is required"),
  image: z.string().url("Invalid image URL").nullable().optional().or(z.literal("")),
  description: z.string().nullable().optional(),
  brand: z.array(z.string()),
});

export type CategoryInput = z.infer<typeof categorySchema>;
