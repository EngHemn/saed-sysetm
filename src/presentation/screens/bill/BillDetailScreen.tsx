"use client";

import React from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { useBillDetailsViewModel } from "@/presentation/viewmodels/useBillDetailsViewModel";
import { BillDetailHeader } from "./components/BillDetailHeader";
import { BillDetailOverviewCard } from "./components/BillDetailOverviewCard";
import { BillDetailItemsTable } from "./components/BillDetailItemsTable";
import { BillDetailSummaryCard, BillItemDialog } from "./components/BillDetailSummaryCard";

interface BillDetailScreenProps {
  id: string;
}

export function BillDetailScreen({ id }: BillDetailScreenProps) {
  const {
    bill,
    isLoading,
    error,
    isDeleting,
    showDeleteDialog,
    setShowDeleteDialog,
    dialogItem,
    setDialogItem,
    handleDelete,
    t,
    dir,
    language,
  } = useBillDetailsViewModel(id);

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto" dir={dir}>
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-9 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </div>
        <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="h-20 w-full rounded-lg" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !bill) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center min-h-[400px]" dir={dir}>
        <div className="bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 p-4 rounded-full mb-4">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-2 text-center">
          {t("bill_not_found", { defaultValue: "Bill Not Found" })}
        </h3>
        <p className="text-sm text-zinc-555 dark:text-zinc-400 max-w-sm mb-4 text-center">
          {error?.message || t("no_results_desc")}
        </p>
        <Link
          href="/dashboard/bills?tab=bill-management"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          {t("back_to_list")}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto" dir={dir}>
      <BillDetailHeader
        bill={bill}
        setShowDeleteDialog={setShowDeleteDialog}
        dir={dir}
        t={t}
      />

      <BillDetailOverviewCard bill={bill} t={t} />

      <BillDetailItemsTable
        items={bill.items}
        setDialogItem={setDialogItem}
        dir={dir}
        t={t}
      />

      <BillDetailSummaryCard bill={bill} t={t} />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800" dir={dir}>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-zinc-900 dark:text-zinc-50 text-left">
              {t("confirm_delete_title")}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-555 dark:text-zinc-400 text-left">
              {t("delete_bill_desc")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-950 dark:text-zinc-50">
              {t("cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-650 dark:hover:bg-red-700"
            >
              {isDeleting ? t("deleting") : t("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <BillItemDialog
        dialogItem={dialogItem}
        setDialogItem={setDialogItem}
        dir={dir}
        language={language}
        t={t}
      />
    </div>
  );
}
