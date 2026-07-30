"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Edit2, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Bill } from "@/domain/entities/Bill";

interface BillDetailHeaderProps {
  bill: Bill;
  setShowDeleteDialog: (show: boolean) => void;
  dir: "ltr" | "rtl";
  t: (key: string, values?: Record<string, string | number>) => string;
}

export function BillDetailHeader({
  bill,
  setShowDeleteDialog,
  dir,
  t,
}: BillDetailHeaderProps) {
  const renderStatusBadge = (status: string) => {
    if (status === "Paid") {
      return (
        <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800">
          {t("paid")}
        </Badge>
      );
    }
    if (status === "Partially Paid") {
      return (
        <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800">
          {t("partially_paid")}
        </Badge>
      );
    }
    return (
      <Badge className="bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border-red-200 dark:border-red-800">
        {t("unpaid")}
      </Badge>
    );
  };

  return (
    <div className="flex items-center justify-between gap-4">
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
          <div className="flex items-center gap-3 justify-start">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              {t("bill")} #{bill.billNumber}
            </h1>
            {renderStatusBadge(bill.paymentStatus)}
          </div>
          <p className="text-sm text-zinc-555 dark:text-zinc-400 text-left">
            {t("bill_details_desc", {
              defaultValue: "Detailed view of customer billing statement",
            })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href={`/dashboard/bills/${bill.id}/edit?tab=bill-management`}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-zinc-50 hover:bg-zinc-50 flex items-center gap-2"
          )}
        >
          <Edit2 className="h-4 w-4" />
          {t("edit")}
        </Link>
        <Button
          variant="destructive"
          onClick={() => setShowDeleteDialog(true)}
          className="flex items-center gap-2"
        >
          <Trash2 className="h-4 w-4" />
          {t("delete")}
        </Button>
      </div>
    </div>
  );
}
