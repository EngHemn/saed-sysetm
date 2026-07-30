"use client";

import React from "react";
import Link from "next/link";
import { Eye, Edit2, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Bill } from "@/domain/entities/Bill";

interface BillListGridProps {
  bills: Bill[];
  updatingStatusId: string | null;
  handleStatusSelect: (bill: Bill, status: "Paid" | "Partially Paid" | "Unpaid") => void;
  setDeleteTargetId: (id: string | null) => void;
  t: (key: string, values?: Record<string, string | number>) => string;
}

export function BillListGrid({
  bills,
  updatingStatusId,
  handleStatusSelect,
  setDeleteTargetId,
  t,
}: BillListGridProps) {
  const renderStatusBadge = (status: string) => {
    if (status === "Paid") {
      return (
        <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100">
          {t("paid")}
        </Badge>
      );
    }
    if (status === "Partially Paid") {
      return (
        <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800 hover:bg-amber-100">
          {t("partially_paid")}
        </Badge>
      );
    }
    return (
      <Badge className="bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border-red-200 dark:border-red-800 hover:bg-red-100">
        {t("unpaid")}
      </Badge>
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
      {bills.map((bill) => (
        <Card
          key={bill.id}
          className="overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
        >
          <CardContent className="p-4 space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-0.5 text-start">
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">{bill.customerName}</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{bill.phone}</p>
              </div>
              <div>
                {bill.paymentStatus === "Paid" ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger render={<div className="inline-block cursor-not-allowed opacity-90 select-none">{renderStatusBadge(bill.paymentStatus)}</div>} />
                      <TooltipContent><p>{t("paid_bill_no_modify", { defaultValue: "Paid bills cannot be modified" })}</p></TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <div className="flex items-center justify-end gap-1.5">
                    <Select
                      value={bill.paymentStatus}
                      onValueChange={(val) => val && val !== bill.paymentStatus && handleStatusSelect(bill, val as "Paid" | "Partially Paid" | "Unpaid")}
                      disabled={updatingStatusId === bill.id}
                    >
                      <SelectTrigger className="h-8 border-none bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800/60 focus:ring-0 w-auto min-w-[120px] justify-center transition-colors cursor-pointer">
                        <SelectValue>
                          {updatingStatusId === bill.id ? (
                            <Badge variant="outline" className="animate-pulse border-zinc-300 dark:border-zinc-700 text-zinc-500">{t("updating")}</Badge>
                          ) : (
                            renderStatusBadge(bill.paymentStatus)
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent align="center" className="bg-white dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-800">
                        <SelectItem value="Paid">{renderStatusBadge("Paid")}</SelectItem>
                        <SelectItem value="Partially Paid">{renderStatusBadge("Partially Paid")}</SelectItem>
                        <SelectItem value="Unpaid">{renderStatusBadge("Unpaid")}</SelectItem>
                      </SelectContent>
                    </Select>

                    {bill.paymentStatus === "Partially Paid" && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger render={<Button type="button" variant="ghost" size="icon" onClick={() => handleStatusSelect(bill, "Partially Paid")} className="h-8 w-8 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-955/20 hover:text-amber-700 dark:hover:text-amber-300 rounded-lg shrink-0 cursor-pointer"><Edit2 className="h-3.5 w-3.5" /></Button>} />
                          <TooltipContent><p>{t("edit_partial_amount", { defaultValue: "Edit Paid Amount" })}</p></TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800/60 text-xs">
              <div className="flex flex-col text-start">
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase">{t("total")}</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">${bill.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex flex-col text-start">
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase">{t("paid")}</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-450">${bill.paidAmount.toFixed(2)}</span>
              </div>
              <div className="flex flex-col text-start">
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase">{t("remaining_amount")}</span>
                <span className="font-semibold text-amber-600 dark:text-amber-450">${bill.remainingAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-900">
              <span className="text-[10px] text-zinc-450 dark:text-zinc-550">{new Date(bill.createdAt).toLocaleDateString()}</span>
              <div className="flex items-center gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger render={<Link href={`/dashboard/bills/${bill.id}?tab=bill-management`} className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-8 w-8 text-zinc-655 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800")}><Eye className="h-4 w-4" /></Link>} />
                    <TooltipContent><p>{t("view")}</p></TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger render={<Link href={`/dashboard/bills/${bill.id}/edit?tab=bill-management`} className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-8 w-8 text-zinc-655 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800")}><Edit2 className="h-4 w-4" /></Link>} />
                    <TooltipContent><p>{t("edit")}</p></TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger render={<Button variant="ghost" size="icon" onClick={() => setDeleteTargetId(bill.id)} className="h-8 w-8 text-red-650 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-955/20 hover:text-red-700 dark:hover:text-red-300 animate-none shrink-0"><Trash2 className="h-4 w-4" /></Button>} />
                    <TooltipContent><p>{t("delete")}</p></TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
