"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Bill } from "@/domain/entities/Bill";

interface BillPartialPaymentDialogProps {
  partialTargetBill: any | null;
  setPartialTargetBill: (bill: any | null) => void;
  partialPaidInput: string;
  setPartialPaidInput: (input: string) => void;
  partialError: string | null;
  setPartialError: (err: string | null) => void;
  confirmPartialPayment: () => Promise<void>;
  updatingStatusId: string | null;
  dir: "ltr" | "rtl";
  t: (key: string, values?: Record<string, string | number>) => string;
}

export function BillPartialPaymentDialog({
  partialTargetBill,
  setPartialTargetBill,
  partialPaidInput,
  setPartialPaidInput,
  partialError,
  setPartialError,
  confirmPartialPayment,
  updatingStatusId,
  dir,
  t,
}: BillPartialPaymentDialogProps) {
  return (
    <Dialog
      open={!!partialTargetBill}
      onOpenChange={(open) => !open && setPartialTargetBill(null)}
    >
      <DialogContent
        className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 max-w-md"
        dir={dir}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-50 text-left">
            {t("set_partial_payment", {
              defaultValue: "Set Partial Payment Amount",
            })}
          </DialogTitle>
          <DialogDescription className="text-sm text-zinc-555 dark:text-zinc-400 text-left">
            {t("set_paid_amount_for", {
              defaultValue: "Set the paid amount for customer",
            })}{" "}
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              {partialTargetBill?.customerName}
            </span>
            .
          </DialogDescription>
        </DialogHeader>

        {partialTargetBill && (
          <div className="space-y-4 py-2">
            <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-sm">
              <span className="text-zinc-500 dark:text-zinc-400">
                {t("total_amount")}:
              </span>
              <span className="font-bold text-zinc-900 dark:text-zinc-50">
                ${partialTargetBill.totalAmount.toFixed(2)}
              </span>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 text-left block">
                {t("paid_amount")} ($)
              </label>
              <Input
                type="number"
                step="0.01"
                min="0.01"
                max={partialTargetBill.totalAmount - 0.01}
                value={partialPaidInput}
                onChange={(e) => {
                  setPartialPaidInput(e.target.value);
                  setPartialError(null);
                }}
                placeholder="0.00"
                className="bg-white dark:bg-zinc-950 border-zinc-300 dark:border-zinc-700 text-left"
              />
              {partialError && (
                <p className="text-xs text-red-655 dark:text-red-400 font-medium text-left">
                  {partialError}
                </p>
              )}
            </div>

            {(() => {
              const amt = parseFloat(partialPaidInput) || 0;
              const remaining = Math.max(
                0,
                partialTargetBill.totalAmount - amt
              );
              return (
                <div className="flex justify-between items-center text-xs p-2.5 rounded-lg bg-amber-50 dark:bg-amber-955/20 border border-amber-200 dark:border-amber-900/40 text-amber-800 dark:text-amber-300">
                  <span>{t("remaining_amount")}:</span>
                  <span className="font-bold">${remaining.toFixed(2)}</span>
                </div>
              );
            })()}
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => setPartialTargetBill(null)}
            className="border-zinc-200 dark:border-zinc-800 text-zinc-955 dark:text-zinc-50"
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={confirmPartialPayment}
            disabled={!!updatingStatusId}
            className="bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-950"
          >
            {updatingStatusId
              ? t("saving", { defaultValue: "Saving..." })
              : t("save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
