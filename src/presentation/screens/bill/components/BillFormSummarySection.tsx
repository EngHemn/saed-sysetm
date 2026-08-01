"use client";

import React from "react";
import Link from "next/link";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { BillInput } from "@/domain/schemas/bill";
import { useLanguage } from "@/presentation/components/language-provider";

interface BillFormSummarySectionProps {
  register: UseFormRegister<BillInput>;
  errors: FieldErrors<BillInput>;
  totalAmount: number;
  remainingAmount: number;
  paymentStatus: string;
  isSubmitting: boolean;
  uploadingImage: boolean;
  fieldsLength: number;
  getValidationError: (msg?: string) => any;
  dir: "ltr" | "rtl";
  t: (key: string, values?: Record<string, string | number>) => string;
}

export function BillFormSummarySection({
  register,
  errors,
  totalAmount,
  remainingAmount,
  paymentStatus,
  isSubmitting,
  uploadingImage,
  fieldsLength,
  getValidationError,
  dir,
  t,
}: BillFormSummarySectionProps) {
  const { formatCurrency } = useLanguage();
  return (
    <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-955 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 text-left">
          {t("payment_calc_summary", {
            defaultValue: "Payment Calculation & Summary",
          })}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="paidAmount"
              className="text-zinc-900 dark:text-zinc-300 text-left block"
            >
              {t("paid_amount")} ({t("currency")}) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="paidAmount"
              type="number"
              step="1"
              min="0"
              {...register("paidAmount", { valueAsNumber: true })}
              className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 font-semibold text-left animate-none"
            />
            {errors.paidAmount && (
              <p className="text-xs font-medium text-red-655 dark:text-red-400 text-left animate-none">
                {getValidationError(errors.paidAmount.message)}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-900 dark:text-zinc-300 text-left block">
              {t("total_amount")} ({t("currency")})
            </Label>
            <div className="h-10 px-3 flex items-center rounded-md bg-zinc-100 dark:bg-zinc-900 font-bold text-zinc-900 dark:text-zinc-50">
              {formatCurrency(totalAmount)}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-900 dark:text-zinc-300 text-left block">
              {t("remaining_amount")} ({t("currency")})
            </Label>
            <div className="h-10 px-3 flex items-center rounded-md bg-zinc-100 dark:bg-zinc-900 font-bold text-amber-600 dark:text-amber-400">
              {formatCurrency(remainingAmount)}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800">
          <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            {t("calculated_status", {
              defaultValue: "Calculated Payment Status:",
            })}
          </span>
          <Badge
            className={cn(
              "px-3 py-1 text-sm font-semibold",
              paymentStatus === "Paid"
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 hover:bg-emerald-100"
                : paymentStatus === "Partially Paid"
                ? "bg-amber-100 text-amber-800 dark:bg-amber-955 dark:text-amber-300 hover:bg-amber-100"
                : "bg-red-100 text-red-800 dark:bg-red-955 dark:text-red-300 hover:bg-red-100"
            )}
          >
            {paymentStatus === "Paid"
              ? t("paid")
              : paymentStatus === "Partially Paid"
              ? t("partially_paid")
              : t("unpaid")}
          </Badge>
        </div>

        <div
          className={`pt-4 border-t border-zinc-100 dark:border-zinc-900 flex ${
            dir === "rtl" ? "justify-start" : "justify-end"
          } gap-3`}
        >
          <Link
            href="/dashboard/bills?tab=bill-management"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-zinc-50 hover:bg-zinc-50",
              isSubmitting && "pointer-events-none opacity-50"
            )}
          >
            {t("cancel")}
          </Link>
          <Button
            type="submit"
            disabled={isSubmitting || uploadingImage || fieldsLength === 0}
            className="bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                {t("updating")}
              </>
            ) : (
              t("save")
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
