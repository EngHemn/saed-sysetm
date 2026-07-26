import React from "react";
import Link from "next/link";
import { ArrowLeft, Eye, ReceiptText, Phone, MapPin, StickyNote, Calendar, DollarSign } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { useCompany } from "@/presentation/hooks/useCompanies";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface CompanyDetailScreenProps {
  id: string;
  onBack: () => void;
}

export function CompanyDetailScreen({ id, onBack }: CompanyDetailScreenProps) {
  const { company, isLoading, error } = useCompany(id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load company details or company not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="h-9 w-9">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Company Details
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            View company information and billing history
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
                <h2 className="text-xl font-extrabold text-zinc-950 dark:text-zinc-50">
                  {company.name}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="flex items-center gap-2 text-zinc-650 dark:text-zinc-300">
                  <Phone className="h-4 w-4 text-zinc-400 shrink-0" />
                  <span className="font-medium">{company.phone}</span>
                </div>

                <div className="flex items-center gap-2 text-zinc-650 dark:text-zinc-300">
                  <MapPin className="h-4 w-4 text-zinc-400 shrink-0" />
                  <span className="font-medium">{company.address || "No address provided"}</span>
                </div>
              </div>

              {company.note && (
                <div className="p-3.5 rounded-lg bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/50 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    <StickyNote className="h-3.5 w-3.5 text-zinc-400" />
                    <span>Note</span>
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap leading-relaxed">
                    {company.note}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 shadow-xs">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-zinc-455 uppercase block">Total Invoiced</span>
            <span className="text-lg font-extrabold text-blue-600 dark:text-blue-400">
              ${(company.bills || []).reduce((sum, b) => sum + b.totalAmount, 0).toFixed(2)}
            </span>
          </div>
        </Card>
        <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 shadow-xs">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-zinc-455 uppercase block">Total Paid</span>
            <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
              ${(company.bills || []).reduce((sum, b) => sum + b.paidAmount, 0).toFixed(2)}
            </span>
          </div>
        </Card>
        <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 shadow-xs">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-zinc-455 uppercase block">Total Remaining</span>
            <span className="text-lg font-extrabold text-rose-600 dark:text-rose-400">
              ${(company.bills || []).reduce((sum, b) => sum + b.remainingAmount, 0).toFixed(2)}
            </span>
          </div>
        </Card>
      </div>

      <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-xs">
        <CardHeader className="bg-zinc-50/50 dark:bg-zinc-900/20 py-4 border-b border-zinc-100 dark:border-zinc-900">
          <CardTitle className="text-sm font-bold text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
            <ReceiptText className="h-4 w-4 text-zinc-450" />
            <span>Associated Bills</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {!company.bills || company.bills.length === 0 ? (
            <div className="p-12 text-center text-xs text-zinc-400">
              No bills found for this company.
            </div>
          ) : (
            <Table className="text-xs">
              <TableHeader>
                <TableRow className="border-zinc-250 dark:border-zinc-800 h-10 bg-zinc-50/20 dark:bg-zinc-950/20">
                  <TableHead className="pl-4">Bill Number</TableHead>
                  <TableHead>Bill Date</TableHead>
                  <TableHead className="text-right">Total Amount</TableHead>
                  <TableHead className="text-right">Paid Amount</TableHead>
                  <TableHead className="text-right">Remaining Amount</TableHead>
                  <TableHead>Payment Status</TableHead>
                  <TableHead className="text-right pr-4 w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {company.bills.map((bill) => (
                  <TableRow
                    key={bill.id}
                    className="border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50/30 dark:hover:bg-zinc-900/10 transition-colors h-12"
                  >
                    <TableCell className="font-semibold text-zinc-950 dark:text-zinc-50 pl-4">
                      {bill.billNumber}
                    </TableCell>
                    <TableCell className="text-zinc-500 dark:text-zinc-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                        <span>{format(new Date(bill.billDate), "yyyy-MM-dd")}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium text-zinc-650 dark:text-zinc-300">
                      ${bill.totalAmount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-medium text-emerald-650 dark:text-emerald-400">
                      ${bill.paidAmount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-bold text-zinc-900 dark:text-zinc-100">
                      ${bill.remainingAmount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "text-[10px] px-2 py-0.5 font-semibold border",
                          bill.paymentStatus === "Paid" &&
                            "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-450 dark:border-emerald-900/50",
                          bill.paymentStatus === "Partially Paid" &&
                            "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-450 dark:border-amber-900/50",
                          bill.paymentStatus === "Unpaid" &&
                            "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-450 dark:border-red-900/50"
                        )}
                        variant="outline"
                      >
                        {bill.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-4">
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
                            <p>View Bill Details</p>
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
