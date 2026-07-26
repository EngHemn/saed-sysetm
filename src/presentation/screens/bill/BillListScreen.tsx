"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Eye, Edit2, Trash2, ReceiptText, Search, RefreshCw, AlertCircle } from "lucide-react";
import { useBills, useBill } from "@/presentation/hooks/useBills";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function BillListScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [statusFilter, setStatusFilter] = useState<"all" | "Paid" | "Partially Paid" | "Unpaid">("all");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, statusFilter]);

  const { bills, total, isLoading, error, refetch, updateStatus } = useBills({
    search: debouncedQuery,
    paymentStatus: statusFilter !== "all" ? statusFilter : undefined,
    page,
    perPage,
    sortBy,
    sortOrder,
  });

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);
  const { deleteBill, isDeleting } = useBill(deleteTargetId || undefined);

  const [partialTargetBill, setPartialTargetBill] = useState<{ id: string; customerName: string; totalAmount: number; currentPaid: number } | null>(null);
  const [partialPaidInput, setPartialPaidInput] = useState<string>("");
  const [partialError, setPartialError] = useState<string | null>(null);

  const handleStatusSelect = async (
    bill: { id: string; customerName: string; totalAmount: number; paidAmount: number; paymentStatus: string },
    newStatus: "Paid" | "Partially Paid" | "Unpaid"
  ) => {
    if (bill.paymentStatus === "Paid") return;

    if (newStatus === "Partially Paid") {
      const defaultAmount =
        bill.paidAmount > 0 && bill.paidAmount < bill.totalAmount
          ? bill.paidAmount
          : Math.round((bill.totalAmount / 2) * 100) / 100;

      setPartialTargetBill({
        id: bill.id,
        customerName: bill.customerName,
        totalAmount: bill.totalAmount,
        currentPaid: defaultAmount,
      });
      setPartialPaidInput(defaultAmount.toString());
      setPartialError(null);
      return;
    }

    try {
      setUpdatingStatusId(bill.id);
      await updateStatus({ id: bill.id, paymentStatus: newStatus });
    } catch (e: unknown) {
      console.error(e);
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const confirmPartialPayment = async () => {
    if (!partialTargetBill) return;
    const amount = parseFloat(partialPaidInput);
    if (isNaN(amount) || amount <= 0) {
      setPartialError("Paid amount must be greater than $0.00");
      return;
    }
    if (amount >= partialTargetBill.totalAmount) {
      setPartialError(`Paid amount must be less than total bill amount ($${partialTargetBill.totalAmount.toFixed(2)})`);
      return;
    }

    try {
      setUpdatingStatusId(partialTargetBill.id);
      await updateStatus({
        id: partialTargetBill.id,
        paymentStatus: "Partially Paid",
        paidAmount: amount,
      });
      setPartialTargetBill(null);
    } catch (e: unknown) {
      console.error(e);
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const clearFilters = () => {
    setStatusFilter("all");
    setSearchQuery("");
    setPage(1);
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    setPage(1);
  };

  const renderSortHeader = (field: string, label: string, className?: string) => {
    const isSorted = sortBy === field;
    return (
      <TableHead
        className={cn("cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900/50 transition-colors select-none", className)}
        onClick={() => handleSort(field)}
      >
        <div className={cn("flex items-center gap-1.5", className?.includes("text-right") && "justify-end")}>
          <span>{label}</span>
          <span className="text-xs text-zinc-400">
            {isSorted ? (sortOrder === "asc" ? "▲" : "▼") : "↕"}
          </span>
        </div>
      </TableHead>
    );
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteBill();
    } catch (e: unknown) {
      console.error(e);
    } finally {
      setDeleteTargetId(null);
    }
  };

  const renderStatusBadge = (status: string) => {
    if (status === "Paid") {
      return (
        <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100">
          Paid
        </Badge>
      );
    }
    if (status === "Partially Paid") {
      return (
        <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800 hover:bg-amber-100">
          Partially Paid
        </Badge>
      );
    }
    return (
      <Badge className="bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border-red-200 dark:border-red-800 hover:bg-red-100">
        Unpaid
      </Badge>
    );
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
        <div className="bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 p-4 rounded-full mb-4">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-2">
          Error Loading Bills
        </h3>
        <p className="text-sm text-zinc-555 dark:text-zinc-400 max-w-sm mb-4">
          {error.message || "Something went wrong while retrieving the bills. Please try again."}
        </p>
        <Button onClick={() => refetch()} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Bill Management
          </h1>
          <p className="text-sm text-zinc-555 dark:text-zinc-400">
            Create, track, and manage customer billing and payment statuses.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => refetch()}
                    className="border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                }
              />
              <TooltipContent>
                <p>Refresh List</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Link
            href="/dashboard/bills/add?tab=bill-management"
            className={cn(
              buttonVariants({ variant: "default" }),
              "bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 flex items-center gap-2"
            )}
          >
            <Plus className="h-4 w-4" />
            Add Bill
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xs">
        <div className="relative col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 dark:text-zinc-555" />
          <Input
            placeholder="Search by Bill #, Company Name, or Phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white"
          />
        </div>

        <div>
          <Select value={statusFilter} onValueChange={(val) => setStatusFilter((val as "all" | "Paid" | "Partially Paid" | "Unpaid") || "all")}>
            <SelectTrigger className="w-full bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800">
              <SelectValue placeholder="All Statuses">
                {statusFilter === "all" ? (
                  <span className="text-zinc-600 dark:text-zinc-400 font-medium">All Payment Statuses</span>
                ) : (
                  renderStatusBadge(statusFilter)
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
              <SelectItem value="all">
                <span className="text-zinc-700 dark:text-zinc-300 font-medium">All Payment Statuses</span>
              </SelectItem>
              <SelectItem value="Paid">
                {renderStatusBadge("Paid")}
              </SelectItem>
              <SelectItem value="Partially Paid">
                {renderStatusBadge("Partially Paid")}
              </SelectItem>
              <SelectItem value="Unpaid">
                {renderStatusBadge("Unpaid")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
        </div>
      ) : bills.length === 0 ? (
        <Card className="border-dashed border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-16 px-8 text-center">
          <CardContent className="space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400">
              <ReceiptText className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                No Bills Found
              </h3>
              <p className="text-sm text-zinc-555 dark:text-zinc-400 max-w-sm mx-auto">
                No bills match your current search query or status filter.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={clearFilters}
              className="mt-4 border-zinc-250 dark:border-zinc-800 text-zinc-950 dark:text-zinc-50 hover:bg-zinc-50"
            >
              Clear All Filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-xs">
          <Table>
            <TableHeader className="bg-zinc-50/50 dark:bg-zinc-900/20">
              <TableRow className="border-zinc-200 dark:border-zinc-800">
                {renderSortHeader("customerName", "Company Name")}
                <TableHead>Phone Number</TableHead>
                {renderSortHeader("totalAmount", "Total Amount", "text-right")}
                {renderSortHeader("paidAmount", "Paid Amount", "text-right")}
                {renderSortHeader("remainingAmount", "Remaining", "text-right")}
                <TableHead className="text-center">Status</TableHead>
                {renderSortHeader("createdAt", "Date", "text-right")}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bills.map((bill) => (
                <TableRow
                  key={bill.id}
                  className="border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 transition-colors"
                >
                  <TableCell className="font-medium text-zinc-800 dark:text-zinc-200">
                    {bill.customerName}
                  </TableCell>
                  <TableCell className="text-zinc-600 dark:text-zinc-400 text-sm">
                    {bill.phone}
                  </TableCell>
                  <TableCell className="text-right font-bold text-zinc-900 dark:text-zinc-50">
                    ${bill.totalAmount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right font-medium text-emerald-600 dark:text-emerald-400">
                    ${bill.paidAmount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right font-medium text-amber-600 dark:text-amber-400">
                    ${bill.remainingAmount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-center">
                    {bill.paymentStatus === "Paid" ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger
                            render={
                              <div className="inline-block cursor-not-allowed opacity-90 select-none">
                                {renderStatusBadge(bill.paymentStatus)}
                              </div>
                            }
                          />
                          <TooltipContent>
                            <p>Paid bills cannot be modified</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <Select
                        value={bill.paymentStatus}
                        onValueChange={(val) => {
                          if (val && val !== bill.paymentStatus) {
                            handleStatusSelect(bill, val as "Paid" | "Partially Paid" | "Unpaid");
                          }
                        }}
                        disabled={updatingStatusId === bill.id}
                      >
                        <SelectTrigger className="h-8 border-none bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800/60 focus:ring-0 w-auto min-w-[130px] justify-center mx-auto transition-colors cursor-pointer">
                          <SelectValue>
                            {updatingStatusId === bill.id ? (
                              <Badge variant="outline" className="animate-pulse border-zinc-300 dark:border-zinc-700 text-zinc-500">Updating...</Badge>
                            ) : (
                              renderStatusBadge(bill.paymentStatus)
                            )}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent align="center" className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                          <SelectItem value="Paid">
                            {renderStatusBadge("Paid")}
                          </SelectItem>
                          <SelectItem value="Partially Paid">
                            {renderStatusBadge("Partially Paid")}
                          </SelectItem>
                          <SelectItem value="Unpaid">
                            {renderStatusBadge("Unpaid")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </TableCell>
                  <TableCell className="text-right text-xs text-zinc-500 dark:text-zinc-400">
                    {new Date(bill.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger
                            render={
                              <Link
                                href={`/dashboard/bills/${bill.id}?tab=bill-management`}
                                className={cn(
                                  buttonVariants({ variant: "ghost", size: "icon" }),
                                  "h-8 w-8 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                )}
                              >
                                <Eye className="h-4 w-4" />
                              </Link>
                            }
                          />
                          <TooltipContent>
                            <p>View Details</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger
                            render={
                              <Link
                                href={`/dashboard/bills/${bill.id}/edit?tab=bill-management`}
                                className={cn(
                                  buttonVariants({ variant: "ghost", size: "icon" }),
                                  "h-8 w-8 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                )}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Link>
                            }
                          />
                          <TooltipContent>
                            <p>Edit Bill</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger
                            render={
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setDeleteTargetId(bill.id)}
                                className="h-8 w-8 text-red-650 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-700 dark:hover:text-red-300"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            }
                          />
                          <TooltipContent>
                            <p>Delete Bill</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-900/5">
            <div className="flex items-center gap-2">
              <span className="text-sm text-zinc-550 dark:text-zinc-400">Show</span>
              <Select
                value={perPage.toString()}
                onValueChange={(val) => {
                  setPerPage(parseInt(val || "10", 10));
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-[80px] h-8 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-zinc-550 dark:text-zinc-400">
                items per page (Total: {total})
              </span>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="h-8 border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-zinc-50 hover:bg-zinc-50"
              >
                Previous
              </Button>
              {(() => {
                const totalPages = Math.max(1, Math.ceil(total / perPage));
                const buttons = [];
                for (let i = 1; i <= totalPages; i++) {
                  if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
                    buttons.push(
                      <Button
                        key={i}
                        variant={page === i ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPage(i)}
                        className={cn(
                          "h-8 w-8 p-0",
                          page === i
                            ? "bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-950"
                            : "border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-zinc-50"
                        )}
                      >
                        {i}
                      </Button>
                    );
                  } else if (i === page - 2 || i === page + 2) {
                    buttons.push(
                      <span key={`dots-${i}`} className="px-1 text-zinc-450">
                        ...
                      </span>
                    );
                  }
                }
                return buttons;
              })()}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((prev) => Math.min(prev + 1, Math.ceil(total / perPage)))}
                disabled={page === Math.ceil(total / perPage) || total === 0}
                className="h-8 border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-zinc-50 hover:bg-zinc-50"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}

      <AlertDialog open={!!deleteTargetId} onOpenChange={(open) => !open && setDeleteTargetId(null)}>
        <AlertDialogContent className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-zinc-900 dark:text-zinc-50">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-555 dark:text-zinc-400">
              This action cannot be undone. This will permanently delete the bill and all associated item records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-950 dark:text-zinc-50">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-650 dark:hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!partialTargetBill} onOpenChange={(open) => !open && setPartialTargetBill(null)}>
        <DialogContent className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
              Set Partial Payment Amount
            </DialogTitle>
            <DialogDescription className="text-sm text-zinc-555 dark:text-zinc-400">
              Set the paid amount for customer <span className="font-semibold text-zinc-900 dark:text-zinc-100">{partialTargetBill?.customerName}</span>.
            </DialogDescription>
          </DialogHeader>

          {partialTargetBill && (
            <div className="space-y-4 py-2">
              <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-sm">
                <span className="text-zinc-500 dark:text-zinc-400">Total Bill Amount:</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-50">${partialTargetBill.totalAmount.toFixed(2)}</span>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Paid Amount ($)
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
                  placeholder="Enter paid amount..."
                  className="bg-white dark:bg-zinc-950 border-zinc-300 dark:border-zinc-700"
                />
                {partialError && (
                  <p className="text-xs text-red-600 dark:text-red-400 font-medium">{partialError}</p>
                )}
              </div>

              {(() => {
                const amt = parseFloat(partialPaidInput) || 0;
                const remaining = Math.max(0, partialTargetBill.totalAmount - amt);
                return (
                  <div className="flex justify-between items-center text-xs p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-amber-800 dark:text-amber-300">
                    <span>Remaining Balance:</span>
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
              className="border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-zinc-50"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmPartialPayment}
              disabled={!!updatingStatusId}
              className="bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-950"
            >
              {updatingStatusId ? "Saving..." : "Confirm & Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
