"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BillFormHeaderProps {
  isEditMode: boolean;
  formSuccessMessage: string | null;
  dir: "ltr" | "rtl";
  t: (key: string, values?: Record<string, string | number>) => string;
}

export function BillFormHeader({
  isEditMode,
  formSuccessMessage,
  dir,
  t,
}: BillFormHeaderProps) {
  return (
    <>
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/bills?tab=bill-management"
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon" }),
            "h-9 w-9 text-zinc-650 dark:text-zinc-400 flex items-center justify-center"
          )}
        >
          <ArrowLeft className={cn("h-5 w-5", dir === "rtl" && "rotate-180")} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {isEditMode ? t("edit_bill") : t("add_bill")}
          </h1>
          <p className="text-sm text-zinc-555 dark:text-zinc-400">
            {isEditMode
              ? t("edit_bill_desc", {
                  defaultValue: "Update bill details and uploaded receipt",
                })
              : t("add_bill_desc", {
                  defaultValue:
                    "Create a new bill, upload receipt, and add items",
                })}
          </p>
        </div>
      </div>

      {formSuccessMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          <span className="text-sm font-medium">{formSuccessMessage}</span>
        </div>
      )}
    </>
  );
}
