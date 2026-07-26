import { z } from "zod";

export const billItemSchema = z.object({
  id: z.string().optional(),
  productId: z.string().nullable().optional(),
  productName: z.string().min(1, "Product name is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unitPrice: z.number().min(0, "Unit price must be at least 0"),
  totalPrice: z.number().min(0, "Total price must be at least 0"),
  initialPrice: z.number().min(0, "Initial price must be at least 0"),
  middlePrice: z.number().min(0, "Middle price must be at least 0"),
  finalPrice: z.number().min(0, "Final price must be at least 0"),
});

export const billSchema = z
  .object({
    customerName: z.string().min(1, "Company name is required"),
    phone: z.string().min(1, "Phone number is required"),
    address: z.string().nullable().optional(),
    image: z.string().url("Invalid image URL").nullable().optional().or(z.literal("")),
    billDate: z.string().or(z.date()).optional(),
    notes: z.string().nullable().optional(),
    paidAmount: z.number().min(0, "Paid amount must be at least 0"),
    items: z.array(billItemSchema).min(1, "At least one product is required"),
    companyId: z.string().nullable().optional(),
  })
  .superRefine((data, ctx) => {
    const calculatedTotal = data.items.reduce(
      (acc, item) => acc + item.quantity * item.unitPrice,
      0
    );
    if (data.paidAmount > calculatedTotal) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Paid amount cannot exceed total bill amount",
        path: ["paidAmount"],
      });
    }

    const seenIds = new Set<string>();
    const seenNames = new Set<string>();
    data.items.forEach((item, idx) => {
      if (item.productId) {
        if (seenIds.has(item.productId)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Product "${item.productName}" has already been added to this bill`,
            path: ["items", idx, "productName"],
          });
        } else {
          seenIds.add(item.productId);
        }
      } else if (item.productName) {
        const normalized = item.productName.trim().toLowerCase();
        if (seenNames.has(normalized)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Product "${item.productName}" has already been added to this bill`,
            path: ["items", idx, "productName"],
          });
        } else {
          seenNames.add(normalized);
        }
      }
    });
  });

export type BillItemInput = z.infer<typeof billItemSchema>;
export type BillInput = z.infer<typeof billSchema>;
