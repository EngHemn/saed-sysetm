"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Eye, ReceiptText, Phone, MapPin, StickyNote, Calendar } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useCompanyDetailsViewModel } from "@/presentation/viewmodels/useCompanyDetailsViewModel";
import { useLanguage } from "@/presentation/components/language-provider";

interface CompanyDetailScreenProps {
  id: string;
  onBack: () => void;
}

export function CompanyDetailScreen({ id, onBack }: CompanyDetailScreenProps) {
  const { formatCurrency } = useLanguage();
  const {
    company,
    isLoading,
    error,
    totalInvoiced,
    totalPaid,
    totalRemaining,
    t,
    dir,
  } = useCompanyDetailsViewModel(id);

  if (isLoading) {
    return (
      <div className="space-y-6" dir={dir}>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="p-8 text-center text-red-500" dir={dir}>
        {t("connection_error")}
      </div>
    );
  }

  return (
    <div className="space-y-6" dir={dir}>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="h-9 w-9">
          <ArrowLeft className={cn("h-5 w-5", dir === "rtl" && "rotate-180")} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {t("company_details")}
          </h1>
          <p className="text-xs text-zinc-550 dark:text-zinc-400">
            {t("company_details_desc", { defaultValue: "View company information and billing history" })}
          </p>
        </div>
      </div>

      <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-xs">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="relative h-40 w-40 rounded-xl overflow-hidden shrink-0 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
              {company.image ? (
                <Image
                  src={company.image}
                  alt={company.name}
                  className="object-cover"
                  fill
                  sizes="160px"
                />
              ) : (
                <ReceiptText className="h-16 w-16 text-zinc-400" />
              )}
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-xl font-extrabold text-zinc-950 dark:text-zinc-50 text-left">
                  {company.name}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="flex items-center gap-2 text-zinc-650 dark:text-zinc-300 text-left">
                  <Phone className="h-4 w-4 text-zinc-400 shrink-0" />
                  <span className="font-medium">{company.phone}</span>
                </div>

                <div className="flex items-center gap-2 text-zinc-650 dark:text-zinc-300 text-left">
                  <MapPin className="h-4 w-4 text-zinc-400 shrink-0" />
                  <span className="font-medium">{company.address || t("no_address_provided", { defaultValue: "No address provided" })}</span>
                </div>
              </div>

              {company.note && (
                <div className="p-3.5 rounded-lg bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/50 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-zinc-700 dark:text-zinc-300 mb-1 text-left">
                    <StickyNote className="h-3.5 w-3.5 text-zinc-400" />
                    <span>{t("note")}</span>
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap leading-relaxed text-left">
                    {company.note}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-955 p-4 shadow-xs">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-zinc-455 uppercase block text-left">{t("total_invoiced")}</span>
            <span className="text-lg font-extrabold text-blue-600 dark:text-blue-400 block text-left">
              {formatCurrency(totalInvoiced)}
            </span>
          </div>
        </Card>
        <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-955 p-4 shadow-xs">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-zinc-455 uppercase block text-left">{t("total_paid")}</span>
            <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 block text-left">
              {formatCurrency(totalPaid)}
            </span>
          </div>
        </Card>
        <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-955 p-4 shadow-xs">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-zinc-455 uppercase block text-left">{t("total_remaining")}</span>
            <span className="text-lg font-extrabold text-rose-600 dark:text-rose-400 block text-left">
              {formatCurrency(totalRemaining)}
            </span>
          </div>
        </Card>
      </div>

      <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-xs">
        <CardHeader className="bg-zinc-50/50 dark:bg-zinc-900/20 py-4 border-b border-zinc-100 dark:border-zinc-900">
          <CardTitle className="text-sm font-bold text-zinc-950 dark:text-zinc-50 flex items-center gap-2 text-left">
            <ReceiptText className="h-4 w-4 text-zinc-450" />
            <span>{t("associated_bills")}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {!company.bills || company.bills.length === 0 ? (
            <div className="p-12 text-center text-xs text-zinc-400">
              {t("no_bills_found", { defaultValue: "No bills found for this company." })}
            </div>
          ) : (
            <Table className="text-xs">
              <TableHeader>
                <TableRow className="border-zinc-250 dark:border-zinc-800 h-10 bg-zinc-50/20 dark:bg-zinc-955/20">
                  <TableHead className={`${dir === "rtl" ? "text-right pr-4" : "text-left pl-4"}`}>{t("bill_number")}</TableHead>
                  <TableHead className={`${dir === "rtl" ? "text-right" : "text-left"}`}>{t("bill_date")}</TableHead>
                  <TableHead className={`${dir === "rtl" ? "text-left" : "text-right"}`}>{t("total_amount")}</TableHead>
                  <TableHead className={`${dir === "rtl" ? "text-left" : "text-right"}`}>{t("paid_amount")}</TableHead>
                  <TableHead className={`${dir === "rtl" ? "text-left" : "text-right"}`}>{t("remaining_amount")}</TableHead>
                  <TableHead className={`${dir === "rtl" ? "text-right" : "text-left"}`}>{t("payment_status")}</TableHead>
                  <TableHead className={`${dir === "rtl" ? "text-left pl-4" : "text-right pr-4"} w-24`}>{t("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {company.bills.map((bill) => (
                  <TableRow
                    key={bill.id}
                    className="border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50/30 dark:hover:bg-zinc-900/10 transition-colors h-12"
                  >
                    <TableCell className={`font-semibold text-zinc-955 dark:text-zinc-50 ${dir === "rtl" ? "pr-4 text-right" : "pl-4 text-left"}`}>
                      {bill.billNumber}
                    </TableCell>
                    <TableCell className={`text-zinc-500 dark:text-zinc-400 ${dir === "rtl" ? "text-right" : "text-left"}`}>
                      <div className="flex items-center gap-1.5 justify-start">
                        <Calendar className="h-3.5 w-3.5 text-zinc-400 animate-none shrink-0" />
                        <span>{format(new Date(bill.billDate), "yyyy-MM-dd")}</span>
                      </div>
                    </TableCell>
                    <TableCell className={`font-medium text-zinc-650 dark:text-zinc-300 ${dir === "rtl" ? "text-left" : "text-right"}`}>
                      {formatCurrency(bill.totalAmount)}
                    </TableCell>
                    <TableCell className={`font-medium text-emerald-650 dark:text-emerald-400 ${dir === "rtl" ? "text-left" : "text-right"}`}>
                      {formatCurrency(bill.paidAmount)}
                    </TableCell>
                    <TableCell className={`font-bold text-zinc-900 dark:text-zinc-100 ${dir === "rtl" ? "text-left" : "text-right"}`}>
                      {formatCurrency(bill.remainingAmount)}
                    </TableCell>
                    <TableCell className={`${dir === "rtl" ? "text-right" : "text-left"}`}>
                      <Badge
                        className={cn(
                          "text-[10px] px-2 py-0.5 font-semibold border",
                          bill.paymentStatus === "Paid" &&
                            "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-455 dark:border-emerald-900/50",
                          bill.paymentStatus === "Partially Paid" &&
                            "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-455 dark:border-amber-900/50",
                          bill.paymentStatus === "Unpaid" &&
                            "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-455 dark:border-red-900/50"
                        )}
                        variant="outline"
                      >
                        {bill.paymentStatus === "Paid"
                          ? t("paid")
                          : bill.paymentStatus === "Partially Paid"
                          ? t("partially_paid")
                          : t("unpaid")}
                      </Badge>
                    </TableCell>
                    <TableCell className={`${dir === "rtl" ? "pl-4 text-left" : "pr-4 text-right"}`}>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger
                            render={
                              <Link
                                href={`/dashboard/bills/${bill.id}?tab=bill-management`}
                                className={cn(
                                  buttonVariants({ variant: "ghost", size: "icon" }),
                                  "h-8 w-8 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors"
                                )}
                              >
                                <Eye className="h-4 w-4" />
                              </Link>
                            }
                          />
                          <TooltipContent className="bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 rounded-lg p-1.5 text-[9px]">
                            <p>{t("view")}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
