import { z } from "zod";

export const companySchema = z.object({
  name: z.string().min(1, "Company name is required"),
  phone: z.string().min(1, "Phone number is required"),
  image: z.string().url("Invalid image URL").nullable().optional().or(z.literal("")),
  note: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
});

export type CompanyInput = z.infer<typeof companySchema>;
