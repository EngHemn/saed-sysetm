"use client";

import React from "react";
import Image from "next/image";
import { Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { getLocalizedValue } from "@/lib/utils";
import { Bill, BillItem } from "@/domain/entities/Bill";

interface BillDetailSummaryCardProps {
  bill: Bill;
  t: (key: string, values?: Record<string, string | number>) => string;
}

export function BillDetailSummaryCard({
  bill,
  t,
}: BillDetailSummaryCardProps) {
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
    <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-955 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 text-left">
          {t("summary")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-zinc-50/70 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block text-left">
              {t("total_amount")}
            </span>
            <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 block text-left">
              ${bill.totalAmount.toFixed(2)}
            </span>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block text-left">
              {t("paid_amount")}
            </span>
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 block text-left">
              ${bill.paidAmount.toFixed(2)}
            </span>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block text-left">
              {t("remaining_amount")}
            </span>
            <span className="text-2xl font-bold text-amber-600 dark:text-amber-400 block text-left">
              ${bill.remainingAmount.toFixed(2)}
            </span>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block text-left">
              {t("payment_status")}
            </span>
            <div className="mt-1 flex justify-start">{renderStatusBadge(bill.paymentStatus)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface BillItemDialogProps {
  dialogItem: BillItem | null;
  setDialogItem: (item: BillItem | null) => void;
  dir: "ltr" | "rtl";
  language: "en" | "ku";
  t: (key: string, values?: Record<string, string | number>) => string;
}

export function BillItemDialog({
  dialogItem,
  setDialogItem,
  dir,
  language,
  t,
}: BillItemDialogProps) {
  return (
    <Dialog
      open={!!dialogItem}
      onOpenChange={(open) => {
        if (!open) {
          setDialogItem(null);
        }
      }}
    >
      <DialogContent
        className="max-w-md bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800"
        dir={dir}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-50 text-left">
            {dialogItem ? dialogItem.productName : ""}
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-500 text-left">
            {t("product_details_in_bill", {
              defaultValue: "Product details in bill items",
            })}
          </DialogDescription>
        </DialogHeader>

        {dialogItem ? (
          <div className="space-y-4 pt-2">
            {dialogItem.product && dialogItem.product.image ? (
              <div className="relative h-48 w-full rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                <Image
                  src={dialogItem.product.image}
                  alt={dialogItem.productName}
                  fill
                  className="object-cover"
                  sizes="350px"
                />
              </div>
            ) : (
              <div className="h-48 w-full rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-400 bg-zinc-50/50 dark:bg-zinc-900/10">
                <Package className="h-8 w-8 text-zinc-400 animate-none shrink-0" />
              </div>
            )}

            {dialogItem.product && (
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <Badge variant="secondary">
                  {t("category")}:{" "}
                  {dialogItem.product.category?.title || "Uncategorized"}
                </Badge>
                {dialogItem.product.brand && (
                  <Badge variant="outline">
                    {t("brand")}: {dialogItem.product.brand}
                  </Badge>
                )}
              </div>
            )}

            <div className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 text-center text-xs">
              <div>
                <span className="text-[10px] text-zinc-400 block">
                  {t("purchase_price")}
                </span>
                <span className="font-bold text-emerald-600">
                  ${dialogItem.initialPrice.toFixed(2)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 block">
                  {t("middle_price")}
                </span>
                <span className="font-bold text-zinc-700 dark:text-zinc-300">
                  ${dialogItem.middlePrice.toFixed(2)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 block">
                  {t("final_price")}
                </span>
                <span className="font-bold text-zinc-900 dark:text-zinc-50">
                  ${dialogItem.finalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            {dialogItem.product && dialogItem.product.description && (
              <div className="text-xs space-y-1 text-left">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300 block">
                  {t("description")}:
                </span>
                <p className="text-zinc-500 dark:text-zinc-400">
                  {getLocalizedValue(dialogItem.product.description, language)}
                </p>
              </div>
            )}

            {!dialogItem.product && (
              <div className="py-2 text-xs text-zinc-500 text-left">
                {t("custom_line_item", { defaultValue: "Custom line item" })}:{" "}
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                  {dialogItem.productName}
                </span>
              </div>
            )}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
