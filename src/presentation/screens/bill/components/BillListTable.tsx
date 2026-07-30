"use client";

import React from "react";
import Link from "next/link";
import { Eye, Edit2, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

interface BillListTableProps {
  bills: Bill[];
  sortBy: string;
  sortOrder: "asc" | "desc";
  handleSort: (field: string) => void;
  updatingStatusId: string | null;
  handleStatusSelect: (bill: Bill, status: "Paid" | "Partially Paid" | "Unpaid") => void;
  setDeleteTargetId: (id: string | null) => void;
  dir: "ltr" | "rtl";
  t: (key: string, values?: Record<string, string | number>) => string;
}

export function BillListTable({
  bills,
  sortBy,
  sortOrder,
  handleSort,
  updatingStatusId,
  handleStatusSelect,
  setDeleteTargetId,
  dir,
  t,
}: BillListTableProps) {
  const renderSortHeader = (field: string, label: string, className?: string) => {
    const isSorted = sortBy === field;
    return (
      <TableHead className={cn("cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900/50 transition-colors select-none", className)} onClick={() => handleSort(field)}>
        <div className={cn("flex items-center gap-1.5", className?.includes("text-right") && "justify-end")}>
          <span>{label}</span>
          <span className="text-xs text-zinc-400">{isSorted ? (sortOrder === "asc" ? "▲" : "▼") : "↕"}</span>
        </div>
      </TableHead>
    );
  };

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
    <Table>
      <TableHeader className="bg-zinc-50/50 dark:bg-zinc-900/20">
        <TableRow className="border-zinc-200 dark:border-zinc-800">
          {renderSortHeader("customerName", t("company_name"))}
          <TableHead className={`${dir === "rtl" ? "text-right" : "text-left"}`}>{t("phone")}</TableHead>
          {renderSortHeader("totalAmount", t("total_amount"), dir === "rtl" ? "text-left" : "text-right")}
          {renderSortHeader("paidAmount", t("paid_amount"), dir === "rtl" ? "text-left" : "text-right")}
          {renderSortHeader("remainingAmount", t("remaining_amount"), dir === "rtl" ? "text-left" : "text-right")}
          <TableHead className="text-center">{t("status")}</TableHead>
          {renderSortHeader("createdAt", t("date"), dir === "rtl" ? "text-left" : "text-right")}
          <TableHead className={`${dir === "rtl" ? "text-left" : "text-right"}`}>{t("actions")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bills.map((bill) => (
          <TableRow key={bill.id} className="border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 transition-colors">
            <TableCell className={`font-medium text-zinc-850 dark:text-zinc-200 ${dir === "rtl" ? "text-right" : "text-left"}`}>{bill.customerName}</TableCell>
            <TableCell className={`text-zinc-600 dark:text-zinc-400 text-sm ${dir === "rtl" ? "text-right" : "text-left"}`}>{bill.phone}</TableCell>
            <TableCell className={`font-bold text-zinc-900 dark:text-zinc-50 ${dir === "rtl" ? "text-left" : "text-right"}`}>${bill.totalAmount.toFixed(2)}</TableCell>
            <TableCell className={`font-medium text-emerald-600 dark:text-emerald-400 ${dir === "rtl" ? "text-left" : "text-right"}`}>${bill.paidAmount.toFixed(2)}</TableCell>
            <TableCell className={`font-medium text-amber-600 dark:text-amber-400 ${dir === "rtl" ? "text-left" : "text-right"}`}>${bill.remainingAmount.toFixed(2)}</TableCell>
            <TableCell className="text-center">
              {bill.paymentStatus === "Paid" ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger render={<div className="inline-block cursor-not-allowed opacity-90 select-none">{renderStatusBadge(bill.paymentStatus)}</div>} />
                    <TooltipContent><p>{t("paid_bill_no_modify", { defaultValue: "Paid bills cannot be modified" })}</p></TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <div className="flex items-center justify-center gap-1.5">
                  <Select value={bill.paymentStatus} onValueChange={(val) => val && val !== bill.paymentStatus && handleStatusSelect(bill, val as "Paid" | "Partially Paid" | "Unpaid")} disabled={updatingStatusId === bill.id}>
                    <SelectTrigger className="h-8 border-none bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800/60 focus:ring-0 w-auto min-w-[130px] justify-center mx-auto transition-colors cursor-pointer">
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
            </TableCell>
            <TableCell className={`text-xs text-zinc-500 dark:text-zinc-400 ${dir === "rtl" ? "text-left" : "text-right"}`}>{new Date(bill.createdAt).toLocaleDateString()}</TableCell>
            <TableCell className={`${dir === "rtl" ? "text-left" : "text-right"}`}>
              <div className={`flex ${dir === "rtl" ? "justify-start" : "justify-end"} items-center gap-1`}>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger render={<Link href={`/dashboard/bills/${bill.id}?tab=bill-management`} className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-8 w-8 text-zinc-650 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800")}><Eye className="h-4 w-4" /></Link>} />
                    <TooltipContent><p>{t("view")}</p></TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger render={<Link href={`/dashboard/bills/${bill.id}/edit?tab=bill-management`} className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-8 w-8 text-zinc-650 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800")}><Edit2 className="h-4 w-4" /></Link>} />
                    <TooltipContent><p>{t("edit")}</p></TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger render={<Button variant="ghost" size="icon" onClick={() => setDeleteTargetId(bill.id)} className="h-8 w-8 text-red-650 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-955/20 hover:text-red-700 dark:hover:text-red-300"><Trash2 className="h-4 w-4" /></Button>} />
                    <TooltipContent><p>{t("delete")}</p></TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
