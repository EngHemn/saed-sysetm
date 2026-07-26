import { z } from "zod";

export const needSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  description: z.string().nullable().optional().or(z.literal("")),
  image: z.string().url("Invalid image URL").nullable().optional().or(z.literal("")),
  priority: z.enum(["Low", "Medium", "High"]),
  productId: z.string().nullable().optional().or(z.literal("")),
});

export type NeedInput = z.infer<typeof needSchema>;
